import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { gallerySections, SectionKey } from "@/lib/gallerySections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Image, Check, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GalleryPhoto {
  id: string;
  section_key: string;
  image_url: string;
  display_order: number;
}

const Admin = () => {
  const [photosBySection, setPhotosBySection] = useState<Record<string, GalleryPhoto[]>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simple password protection (for demo purposes)
  const ADMIN_PASSWORD = "0000";

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllPhotos();
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "Неверный пароль",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async (sectionKey: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(sectionKey);
    const currentPhotos = photosBySection[sectionKey] || [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${sectionKey}/${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file);

      if (uploadError) {
        toast({
          title: "Ошибка загрузки",
          description: uploadError.message,
          variant: "destructive"
        });
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("gallery_photos")
        .insert({
          section_key: sectionKey,
          image_url: urlData.publicUrl,
          display_order: currentPhotos.length + i
        });

      if (dbError) {
        toast({
          title: "Ошибка сохранения",
          description: dbError.message,
          variant: "destructive"
        });
      }
    }

    toast({
      title: "Фото загружены",
      description: `Загружено ${files.length} фото`
    });

    setUploading(null);
    fetchAllPhotos();
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    // Extract file path from URL
    const urlParts = photo.image_url.split("/gallery/");
    if (urlParts[1]) {
      await supabase.storage
        .from("gallery")
        .remove([urlParts[1]]);
    }

    const { error } = await supabase
      .from("gallery_photos")
      .delete()
      .eq("id", photo.id);

    if (error) {
      toast({
        title: "Ошибка удаления",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Фото удалено" });
      fetchAllPhotos();
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
            <h1 className="text-2xl md:text-3xl font-bold">Управление галереей</h1>
            <p className="text-muted-foreground">Загрузите фотографии для каждого раздела сайта</p>
          </div>
        </div>

        <div className="space-y-6">
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
                        {isComplete ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-destructive" />
                        )}
                      </CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${isComplete ? 'text-green-600' : 'text-destructive'}`}>
                        {photos.length} / {section.requiredPhotos}
                      </div>
                      <div className="text-xs text-muted-foreground">фото</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 bg-muted p-2 rounded">
                    💡 {section.tips}
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Upload button */}
                  <div className="mb-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleUpload(section.key, e.target.files)}
                        disabled={uploading === section.key}
                      />
                      <Button 
                        variant="outline" 
                        className="w-full md:w-auto"
                        disabled={uploading === section.key}
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading === section.key ? "Загрузка..." : "Загрузить фото"}
                        </span>
                      </Button>
                    </label>
                  </div>

                  {/* Photo grid */}
                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {photos.map((photo) => (
                        <div key={photo.id} className="relative group aspect-[4/3]">
                          <img
                            src={photo.image_url}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
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
        </div>
      </div>
    </div>
  );
};

export default Admin;
