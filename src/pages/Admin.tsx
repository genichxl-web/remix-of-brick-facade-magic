import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { gallerySections } from "@/lib/gallerySections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Image, Check, X, ArrowLeft, Palette, Layers, Bot, Save, Briefcase, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GalleryPhoto {
  id: string;
  section_key: string;
  image_url: string;
  display_order: number;
}

interface PillarColor {
  id: string;
  name: string;
  image_url: string;
  display_order: number;
}

interface FillType {
  id: string;
  name: string;
  image_url: string;
  display_order: number;
}


interface PortfolioPhoto {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
}

interface PortfolioProject {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  display_order: number | null;
  photos: PortfolioPhoto[];
}

const Admin = () => {
  const [photosBySection, setPhotosBySection] = useState<Record<string, GalleryPhoto[]>>({});
  const [pillarColors, setPillarColors] = useState<PillarColor[]>([]);
  const [fillTypes, setFillTypes] = useState<FillType[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [savingProject, setSavingProject] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newFillName, setNewFillName] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const ADMIN_PASSWORD = "0000";
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  const compressImage = async (file: File, maxSizeBytes: number = MAX_FILE_SIZE): Promise<File> => {
    // If file is already small enough, return as-is
    if (file.size <= maxSizeBytes) return file;

    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Calculate scale factor based on file size ratio
        const sizeRatio = maxSizeBytes / file.size;
        const scaleFactor = Math.sqrt(sizeRatio) * 0.9; // 0.9 for safety margin
        
        width = Math.floor(width * scaleFactor);
        height = Math.floor(height * scaleFactor);
        
        // Ensure minimum dimensions
        width = Math.max(width, 100);
        height = Math.max(height, 100);
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels
        const tryCompress = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size <= maxSizeBytes) {
                const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
                resolve(compressedFile);
              } else if (quality > 0.3) {
                tryCompress(quality - 0.1);
              } else {
                // Last resort: further reduce dimensions
                const smallerCanvas = document.createElement('canvas');
                smallerCanvas.width = Math.floor(width * 0.7);
                smallerCanvas.height = Math.floor(height * 0.7);
                const smallerCtx = smallerCanvas.getContext('2d');
                smallerCtx?.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
                smallerCanvas.toBlob(
                  (smallBlob) => {
                    const compressedFile = new File([smallBlob || blob!], file.name, { type: 'image/jpeg' });
                    resolve(compressedFile);
                  },
                  'image/jpeg',
                  0.7
                );
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        tryCompress(0.85);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllPhotos();
      fetchPillarColors();
      fetchFillTypes();
      fetchAiPrompt();
      fetchPortfolioProjects();
    }
  }, [isAuthenticated]);

  const fetchAllPhotos = async () => {
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      const grouped = data.reduce((acc, photo) => {
        if (!acc[photo.section_key]) {
          acc[photo.section_key] = [];
        }
        acc[photo.section_key].push(photo);
        return acc;
      }, {} as Record<string, GalleryPhoto[]>);
      setPhotosBySection(grouped);
    }
  };


  const fetchPillarColors = async () => {
    const { data } = await supabase
      .from("pillar_colors")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setPillarColors(data);
  };

  const fetchFillTypes = async () => {
    const { data } = await supabase
      .from("fill_types")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setFillTypes(data);
  };

  const fetchAiPrompt = async () => {
    const { data } = await supabase
      .from("ai_settings")
      .select("value")
      .eq("key", "system_prompt")
      .single();
    if (data) setAiPrompt(data.value);
  };

  const fetchPortfolioProjects = async () => {
    const { data: projectsData } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (!projectsData) return;

    const { data: photosData } = await supabase
      .from("portfolio_photos")
      .select("*")
      .order("display_order", { ascending: true });

    const projectsWithPhotos = projectsData.map(project => ({
      ...project,
      photos: (photosData || []).filter(photo => photo.project_id === project.id)
    }));

    setPortfolioProjects(projectsWithPhotos);
  };

  const addPortfolioProject = async () => {
    const { error } = await supabase.from("portfolio_projects").insert({
      title: "Новый проект",
      display_order: portfolioProjects.length
    });
    if (!error) {
      toast({ title: "Проект добавлен" });
      fetchPortfolioProjects();
    }
  };

  const updatePortfolioProject = async (projectId: string, field: string, value: string) => {
    setPortfolioProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, [field]: value } : p
    ));
  };

  const savePortfolioProject = async (project: PortfolioProject) => {
    setSavingProject(project.id);
    const { error } = await supabase
      .from("portfolio_projects")
      .update({ 
        title: project.title, 
        location: project.location, 
        description: project.description 
      })
      .eq("id", project.id);
    
    if (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } else {
      toast({ title: "Проект сохранён" });
    }
    setSavingProject(null);
  };

  const deletePortfolioProject = async (projectId: string) => {
    // Photos will be deleted by CASCADE
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", projectId);
    if (!error) {
      toast({ title: "Проект удалён" });
      fetchPortfolioProjects();
    }
  };

  const handlePortfolioPhotoUpload = async (projectId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const project = portfolioProjects.find(p => p.id === projectId);
    if (!project) return;

    setUploading(`portfolio-${projectId}`);
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (project.photos.length + uploadedCount >= 8) break;
      
      const file = files[i];
      if (!validateFile(file)) continue;

      const compressedFile = await compressImage(file);
      const fileName = `portfolio/${projectId}/${Date.now()}-${i}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, compressedFile);

      if (uploadError) continue;

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("portfolio_photos").insert({
        project_id: projectId,
        image_url: urlData.publicUrl,
        display_order: project.photos.length + uploadedCount
      });

      if (!dbError) uploadedCount++;
    }

    if (uploadedCount > 0) {
      toast({ title: `Загружено ${uploadedCount} фото` });
    }

    setUploading(null);
    fetchPortfolioProjects();
  };

  const deletePortfolioPhoto = async (photo: PortfolioPhoto) => {
    const urlParts = photo.image_url.split("/gallery/");
    if (urlParts[1]) {
      await supabase.storage.from("gallery").remove([urlParts[1]]);
    }
    const { error } = await supabase.from("portfolio_photos").delete().eq("id", photo.id);
    if (!error) {
      toast({ title: "Фото удалено" });
      fetchPortfolioProjects();
    }
  };

  const saveAiPrompt = async () => {
    setSavingPrompt(true);
    const { error } = await supabase
      .from("ai_settings")
      .update({ value: aiPrompt, updated_at: new Date().toISOString() })
      .eq("key", "system_prompt");
    
    if (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } else {
      toast({ title: "Промт сохранён" });
    }
    setSavingPrompt(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      toast({ title: "Неверный пароль", variant: "destructive" });
    }
  };

  const validateFile = (file: File): boolean => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(fileExt || '')) {
      toast({
        title: "Неподдерживаемый формат",
        description: `Используйте JPG, PNG или WebP.`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleUpload = async (sectionKey: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(sectionKey);
    const currentPhotos = photosBySection[sectionKey] || [];
    let uploadedCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validateFile(file)) continue;

      const compressedFile = await compressImage(file);
      const fileExt = 'jpg'; // Always jpg after compression
      const fileName = `${sectionKey}/${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, compressedFile);

      if (uploadError) {
        toast({ title: "Ошибка загрузки", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("gallery_photos")
        .insert({
          section_key: sectionKey,
          image_url: urlData.publicUrl,
          display_order: currentPhotos.length + i
        });

      if (!dbError) uploadedCount++;
    }

    if (uploadedCount > 0) {
      toast({ title: "Фото загружены", description: `Загружено ${uploadedCount} фото` });
    }

    setUploading(null);
    fetchAllPhotos();
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    const urlParts = photo.image_url.split("/gallery/");
    if (urlParts[1]) {
      await supabase.storage.from("gallery").remove([urlParts[1]]);
    }

    const { error } = await supabase.from("gallery_photos").delete().eq("id", photo.id);

    if (!error) {
      toast({ title: "Фото удалено" });
      fetchAllPhotos();
    }
  };

  const handleColorUpload = async (file: File) => {
    if (!newColorName.trim()) {
      toast({ title: "Введите название цвета", variant: "destructive" });
      return;
    }
    if (!validateFile(file)) return;

    setUploading("color");
    const compressedFile = await compressImage(file);
    const fileName = `colors/${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, compressedFile);
    if (uploadError) {
      toast({ title: "Ошибка загрузки", description: uploadError.message, variant: "destructive" });
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

    const { error: dbError } = await supabase.from("pillar_colors").insert({
      name: newColorName.trim(),
      image_url: urlData.publicUrl,
      display_order: pillarColors.length
    });

    if (!dbError) {
      toast({ title: "Цвет добавлен" });
      setNewColorName("");
      fetchPillarColors();
    }
    setUploading(null);
  };

  const handleBulkColorUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading("color-bulk");
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validateFile(file)) continue;

      // Extract name from filename (remove extension)
      const colorName = file.name.replace(/\.[^/.]+$/, "").trim();
      if (!colorName) continue;

      const compressedFile = await compressImage(file);
      const fileName = `colors/${Date.now()}-${i}.jpg`;

      const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, compressedFile);
      if (uploadError) continue;

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("pillar_colors").insert({
        name: colorName,
        image_url: urlData.publicUrl,
        display_order: pillarColors.length + uploadedCount
      });

      if (!dbError) uploadedCount++;
    }

    if (uploadedCount > 0) {
      toast({ title: "Цвета добавлены", description: `Загружено ${uploadedCount} цветов` });
      fetchPillarColors();
    }
    setUploading(null);
  };

  const handleFillUpload = async (file: File) => {
    if (!newFillName.trim()) {
      toast({ title: "Введите название заполнения", variant: "destructive" });
      return;
    }
    if (!validateFile(file)) return;

    setUploading("fill");
    const compressedFile = await compressImage(file);
    const fileName = `fills/${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, compressedFile);
    if (uploadError) {
      toast({ title: "Ошибка загрузки", description: uploadError.message, variant: "destructive" });
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

    const { error: dbError } = await supabase.from("fill_types").insert({
      name: newFillName.trim(),
      image_url: urlData.publicUrl,
      display_order: fillTypes.length
    });

    if (!dbError) {
      toast({ title: "Заполнение добавлено" });
      setNewFillName("");
      fetchFillTypes();
    }
    setUploading(null);
  };

  const handleDeleteColor = async (color: PillarColor) => {
    const urlParts = color.image_url.split("/gallery/");
    if (urlParts[1]) {
      await supabase.storage.from("gallery").remove([urlParts[1]]);
    }
    const { error } = await supabase.from("pillar_colors").delete().eq("id", color.id);
    if (!error) {
      toast({ title: "Цвет удалён" });
      fetchPillarColors();
    }
  };

  const handleDeleteFill = async (fill: FillType) => {
    const urlParts = fill.image_url.split("/gallery/");
    if (urlParts[1]) {
      await supabase.storage.from("gallery").remove([urlParts[1]]);
    }
    const { error } = await supabase.from("fill_types").delete().eq("id", fill.id);
    if (!error) {
      toast({ title: "Заполнение удалено" });
      fetchFillTypes();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Админ-панель БРИК</CardTitle>
            <CardDescription>Введите пароль для доступа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full">Войти</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Админ-панель БРИК</h1>
            <p className="text-muted-foreground">Управление контентом сайта</p>
          </div>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Портфолио ({portfolioProjects.length}/20)
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Галерея
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Цвета ({pillarColors.length}/18)
            </TabsTrigger>
            <TabsTrigger value="fills" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Заполнения ({fillTypes.length}/6)
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Промт
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Управление портфолио
                    </CardTitle>
                    <CardDescription>Добавьте до 20 проектов. Каждый проект может содержать до 8 фотографий.</CardDescription>
                  </div>
                  {portfolioProjects.length < 20 && (
                    <Button onClick={addPortfolioProject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить проект
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioProjects.length === 0 ? (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
                    <div className="text-center">
                      <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Нет проектов в портфолио</p>
                    </div>
                  </div>
                ) : (
                  portfolioProjects.map((project, index) => (
                    <Card key={project.id} className="border">
                      <CardHeader className="pb-2">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground font-mono">#{index + 1}</span>
                            <div>
                              <h4 className="font-medium">{project.title || "Без названия"}</h4>
                              <p className="text-sm text-muted-foreground">
                                {project.location || "Локация не указана"} • {project.photos.length}/8 фото
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); deletePortfolioProject(project.id); }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            {expandedProject === project.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {expandedProject === project.id && (
                        <CardContent className="space-y-4 pt-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Название проекта</label>
                              <Input
                                value={project.title || ""}
                                onChange={(e) => updatePortfolioProject(project.id, 'title', e.target.value)}
                                placeholder="Например: Забор 32 м, автоматические ворота"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Поселок / Локация</label>
                              <Input
                                value={project.location || ""}
                                onChange={(e) => updatePortfolioProject(project.id, 'location', e.target.value)}
                                placeholder="Например: КП «Новорижский»"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Описание</label>
                            <Textarea
                              value={project.description || ""}
                              onChange={(e) => updatePortfolioProject(project.id, 'description', e.target.value)}
                              placeholder="Подробное описание проекта..."
                              className="min-h-[100px]"
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button 
                              size="sm" 
                              onClick={() => savePortfolioProject(project)}
                              disabled={savingProject === project.id}
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {savingProject === project.id ? "Сохранение..." : "Сохранить"}
                            </Button>
                          </div>

                          <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-sm font-medium">Фотографии проекта ({project.photos.length}/8)</label>
                              {project.photos.length < 8 && (
                                <label className="cursor-pointer">
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => handlePortfolioPhotoUpload(project.id, e.target.files)}
                                    disabled={uploading === `portfolio-${project.id}`}
                                  />
                                  <Button variant="outline" size="sm" disabled={uploading === `portfolio-${project.id}`} asChild>
                                    <span>
                                      <Upload className="h-4 w-4 mr-2" />
                                      {uploading === `portfolio-${project.id}` ? "Загрузка..." : "Загрузить фото"}
                                    </span>
                                  </Button>
                                </label>
                              )}
                            </div>
                            {project.photos.length > 0 ? (
                              <div className="grid grid-cols-4 gap-2">
                                {project.photos.map((photo) => (
                                  <div key={photo.id} className="relative group aspect-video">
                                    <img src={photo.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                                    <button
                                      onClick={() => deletePortfolioPhoto(photo)}
                                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-20 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                                Нет фотографий
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            {gallerySections.map((section) => {
              const photos = photosBySection[section.key] || [];
              const isComplete = photos.length >= section.requiredPhotos;
              
              return (
                <Card key={section.key}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {section.name}
                          {isComplete ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-destructive" />}
                        </CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${isComplete ? 'text-green-600' : 'text-destructive'}`}>
                          {photos.length} / {section.requiredPhotos}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 bg-muted p-2 rounded">💡 {section.tips}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Photo upload */}
                    <div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          multiple
                          className="hidden"
                          onChange={(e) => handleUpload(section.key, e.target.files)}
                          disabled={uploading === section.key}
                        />
                        <Button variant="outline" disabled={uploading === section.key} asChild>
                          <span><Upload className="h-4 w-4 mr-2" />{uploading === section.key ? "Загрузка..." : "Загрузить фото"}</span>
                        </Button>
                      </label>
                    </div>

                    {photos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {photos.map((photo) => (
                          <div key={photo.id} className="relative group aspect-[4/3]">
                            <img src={photo.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                            <button
                              onClick={() => handleDelete(photo)}
                              className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
                        <div className="text-center">
                          <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Нет фотографий</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Цвета столбов
                </CardTitle>
                <CardDescription>Добавьте 18 вариантов цветов с фотографиями. Эти фото будут показаны в AI-чате.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium mb-2 block">Название цвета</label>
                    <Input
                      placeholder="Например: Графит"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                    />
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleColorUpload(e.target.files[0])}
                      disabled={uploading === "color" || !newColorName.trim()}
                    />
                    <Button variant="default" disabled={uploading === "color" || !newColorName.trim()} asChild>
                      <span><Upload className="h-4 w-4 mr-2" />{uploading === "color" ? "Загрузка..." : "Добавить цвет"}</span>
                    </Button>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={(e) => handleBulkColorUpload(e.target.files)}
                      disabled={uploading === "color-bulk"}
                    />
                    <Button variant="outline" disabled={uploading === "color-bulk"} asChild>
                      <span><Upload className="h-4 w-4 mr-2" />{uploading === "color-bulk" ? "Загрузка..." : "Групповая загрузка"}</span>
                    </Button>
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">💡 Для групповой загрузки название цвета берётся из имени файла</p>

                {pillarColors.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {pillarColors.map((color) => (
                      <div key={color.id} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg">
                          <img src={color.image_url} alt={color.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm font-medium text-center mt-2">{color.name}</p>
                        <button
                          onClick={() => handleDeleteColor(color)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
                    <div className="text-center">
                      <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Нет цветов</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Типы заполнения
                </CardTitle>
                <CardDescription>Добавьте 6 вариантов заполнения с фотографиями. Эти фото будут показаны в AI-чате.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Название заполнения</label>
                    <Input
                      placeholder="Например: Профлист"
                      value={newFillName}
                      onChange={(e) => setNewFillName(e.target.value)}
                    />
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFillUpload(e.target.files[0])}
                      disabled={uploading === "fill" || !newFillName.trim()}
                    />
                    <Button variant="default" disabled={uploading === "fill" || !newFillName.trim()} asChild>
                      <span><Upload className="h-4 w-4 mr-2" />{uploading === "fill" ? "Загрузка..." : "Добавить заполнение"}</span>
                    </Button>
                  </label>
                </div>

                {fillTypes.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {fillTypes.map((fill) => (
                      <div key={fill.id} className="relative group">
                        <div className="aspect-video overflow-hidden rounded-lg">
                          <img src={fill.image_url} alt={fill.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm font-medium text-center mt-2">{fill.name}</p>
                        <button
                          onClick={() => handleDeleteFill(fill)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
                    <div className="text-center">
                      <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Нет заполнений</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Системный промт AI-ассистента
                </CardTitle>
                <CardDescription>
                  Настройте поведение AI-ассистента. Промт определяет как бот общается с клиентами.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Введите системный промт для AI..."
                  className="min-h-[400px] font-mono text-sm"
                />
                <div className="flex justify-end">
                  <Button onClick={saveAiPrompt} disabled={savingPrompt}>
                    <Save className="h-4 w-4 mr-2" />
                    {savingPrompt ? "Сохранение..." : "Сохранить промт"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
