import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { gallerySections } from "@/lib/gallerySections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Image, Check, X, ArrowLeft, Palette, Layers, Bot, Save, Plus, FileText, Briefcase } from "lucide-react";
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

interface SectionText {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
}

interface SectionItem {
  id: string;
  section_key: string;
  text: string;
  display_order: number;
}

interface PortfolioProject {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

const Admin = () => {
  const [photosBySection, setPhotosBySection] = useState<Record<string, GalleryPhoto[]>>({});
  const [sectionTexts, setSectionTexts] = useState<Record<string, SectionText>>({});
  const [sectionItems, setSectionItems] = useState<SectionItem[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [pillarColors, setPillarColors] = useState<PillarColor[]>([]);
  const [fillTypes, setFillTypes] = useState<FillType[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [savingText, setSavingText] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newFillName, setNewFillName] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");
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
      fetchSectionTexts();
      fetchSectionItems();
      fetchPortfolioProjects();
      fetchPillarColors();
      fetchFillTypes();
      fetchAiPrompt();
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

  const fetchSectionTexts = async () => {
    const { data } = await supabase
      .from("section_texts")
      .select("*");
    if (data) {
      const grouped = data.reduce((acc, text) => {
        acc[text.section_key] = text;
        return acc;
      }, {} as Record<string, SectionText>);
      setSectionTexts(grouped);
    }
  };

  const updateSectionText = async (sectionKey: string, field: 'title' | 'subtitle' | 'description', value: string) => {
    setSectionTexts(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value
      }
    }));
  };

  const saveSectionText = async (sectionKey: string) => {
    setSavingText(sectionKey);
    const text = sectionTexts[sectionKey];
    if (!text) {
      setSavingText(null);
      return;
    }

    const { error } = await supabase
      .from("section_texts")
      .update({ 
        title: text.title, 
        subtitle: text.subtitle, 
        description: text.description 
      })
      .eq("section_key", sectionKey);

    if (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } else {
      toast({ title: "Тексты сохранены" });
    }
    setSavingText(null);
  };

  const fetchSectionItems = async () => {
    const { data } = await supabase
      .from("section_items")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setSectionItems(data);
  };

  const fetchPortfolioProjects = async () => {
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setPortfolioProjects(data);
  };

  const addSectionItem = async (sectionKey: string) => {
    if (!newItemText.trim()) return;
    const { error } = await supabase.from("section_items").insert({
      section_key: sectionKey,
      text: newItemText.trim(),
      display_order: sectionItems.filter(i => i.section_key === sectionKey).length
    });
    if (!error) {
      setNewItemText("");
      fetchSectionItems();
      toast({ title: "Пункт добавлен" });
    }
  };

  const updateSectionItem = async (id: string, text: string) => {
    setSectionItems(prev => prev.map(item => item.id === id ? { ...item, text } : item));
  };

  const saveSectionItem = async (item: SectionItem) => {
    const { error } = await supabase
      .from("section_items")
      .update({ text: item.text })
      .eq("id", item.id);
    if (!error) toast({ title: "Сохранено" });
  };

  const deleteSectionItem = async (id: string) => {
    const { error } = await supabase.from("section_items").delete().eq("id", id);
    if (!error) {
      fetchSectionItems();
      toast({ title: "Пункт удалён" });
    }
  };

  const addPortfolioProject = async () => {
    if (!newProjectTitle.trim()) return;
    const { error } = await supabase.from("portfolio_projects").insert({
      title: newProjectTitle.trim(),
      display_order: portfolioProjects.length
    });
    if (!error) {
      setNewProjectTitle("");
      fetchPortfolioProjects();
      toast({ title: "Проект добавлен" });
    }
  };

  const updatePortfolioProject = async (id: string, field: 'title' | 'description', value: string) => {
    setPortfolioProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const savePortfolioProject = async (project: PortfolioProject) => {
    const { error } = await supabase
      .from("portfolio_projects")
      .update({ title: project.title, description: project.description })
      .eq("id", project.id);
    if (!error) toast({ title: "Проект сохранён" });
  };

  const uploadPortfolioImage = async (projectId: string, file: File) => {
    if (!validateFile(file)) return;
    setUploading(`portfolio-${projectId}`);
    
    const compressedFile = await compressImage(file);
    const fileName = `portfolio/${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, compressedFile);
    if (uploadError) {
      toast({ title: "Ошибка загрузки", variant: "destructive" });
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
    
    const { error } = await supabase
      .from("portfolio_projects")
      .update({ image_url: urlData.publicUrl })
      .eq("id", projectId);

    if (!error) {
      fetchPortfolioProjects();
      toast({ title: "Фото загружено" });
    }
    setUploading(null);
  };

  const deletePortfolioProject = async (project: PortfolioProject) => {
    if (project.image_url) {
      const urlParts = project.image_url.split("/gallery/");
      if (urlParts[1]) {
        await supabase.storage.from("gallery").remove([urlParts[1]]);
      }
    }
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", project.id);
    if (!error) {
      fetchPortfolioProjects();
      toast({ title: "Проект удалён" });
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

        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Галерея</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Контент</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Портфолио</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Цвета</span>
            </TabsTrigger>
            <TabsTrigger value="fills" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Заполнения</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">AI Промт</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            {gallerySections.map((section) => {
              const photos = photosBySection[section.key] || [];
              const sectionText = sectionTexts[section.key];
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
                    {/* Text editing fields */}
                    {sectionText && (
                      <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Заголовок</label>
                            <Input
                              value={sectionText.title || ""}
                              onChange={(e) => updateSectionText(section.key, 'title', e.target.value)}
                              placeholder="Заголовок раздела"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Подзаголовок</label>
                            <Input
                              value={sectionText.subtitle || ""}
                              onChange={(e) => updateSectionText(section.key, 'subtitle', e.target.value)}
                              placeholder="Подзаголовок раздела"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            onClick={() => saveSectionText(section.key)}
                            disabled={savingText === section.key}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {savingText === section.key ? "Сохранение..." : "Сохранить тексты"}
                          </Button>
                        </div>
                      </div>
                    )}

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

          <TabsContent value="content" className="space-y-6">
            {/* Section Items - Что мы делаем */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Пункты раздела «Что мы делаем»
                </CardTitle>
                <CardDescription>Редактируйте пункты списка услуг</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Новый пункт..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSectionItem('services')}
                  />
                  <Button onClick={() => addSectionItem('services')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>
                <div className="space-y-2">
                  {sectionItems.filter(item => item.section_key === 'services').map((item) => (
                    <div key={item.id} className="flex gap-2 items-center">
                      <Input
                        value={item.text}
                        onChange={(e) => updateSectionItem(item.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" variant="outline" onClick={() => saveSectionItem(item)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteSectionItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Проекты портфолио
                </CardTitle>
                <CardDescription>Добавляйте проекты с названием, описанием и фото</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Название проекта..."
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPortfolioProject()}
                  />
                  <Button onClick={addPortfolioProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить проект
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="aspect-video relative bg-muted">
                        {project.image_url ? (
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && uploadPortfolioImage(project.id, e.target.files[0])}
                            disabled={uploading === `portfolio-${project.id}`}
                          />
                          <span className="text-white flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            {uploading === `portfolio-${project.id}` ? "Загрузка..." : "Загрузить фото"}
                          </span>
                        </label>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <Input
                          value={project.title}
                          onChange={(e) => updatePortfolioProject(project.id, 'title', e.target.value)}
                          placeholder="Название проекта"
                        />
                        <Textarea
                          value={project.description || ""}
                          onChange={(e) => updatePortfolioProject(project.id, 'description', e.target.value)}
                          placeholder="Описание проекта..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" onClick={() => savePortfolioProject(project)}>
                            <Save className="h-4 w-4 mr-2" />
                            Сохранить
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deletePortfolioProject(project)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {portfolioProjects.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
                    <div className="text-center">
                      <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Нет проектов</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
