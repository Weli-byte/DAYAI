'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateModel, useCategories, useTags } from '@/hooks/use-models';
import { ROUTES } from '@/constants/routes';

// ── Validation schema ─────────────────────────────────────────────────────────
const schema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalıdır').max(200),
  description: z.string().optional(),
  framework: z.enum(['PYTORCH', 'TENSORFLOW', 'SKLEARN', 'ONNX', 'JAX', 'OTHER']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  license: z.string().max(100).optional(),
  categoryId: z.string().optional(),
  // ownerId will be supplied from the logged-in user in a future milestone
  ownerId: z.string().default('demo'),
});

type FormValues = z.infer<typeof schema>;

export default function CreateModelPage() {
  const router = useRouter();
  const createModel = useCreateModel();
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'DRAFT', framework: 'OTHER', ownerId: 'demo' },
  });

  async function onSubmit(values: FormValues) {
    try {
      const model = await createModel.mutateAsync({
        title: values.title,
        description: values.description,
        framework: values.framework,
        status: values.status,
        license: values.license,
        categoryId: values.categoryId,
        ownerId: values.ownerId,
      });
      toast.success('Model başarıyla oluşturuldu');
      router.push(ROUTES.MODEL_DETAIL(model.id));
    } catch (err) {
      toast.error((err as Error)?.message ?? 'Model oluşturulamadı');
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2">
        <Link href={ROUTES.MARKETPLACE}>
          <ArrowLeft className="h-4 w-4" />
          Pazar Yerine Dön
        </Link>
      </Button>

      {/* Page title */}
      <div className="flex items-center gap-3">
        <PlusCircle className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">YZ Modeli Yayımla</h1>
          <p className="text-sm text-muted-foreground">
            YZ modelinizi pazar yeri kayıt defterine ekleyin.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Temel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Model Adı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="örn. CIFAR-10 ResNet Sınıflandırıcı"
                {...register('title')}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                placeholder="Modelinizi açıklayın — mimari, eğitim verisi, kullanım senaryosu, performans metrikleri…"
                rows={4}
                {...register('description')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sınıflandırma</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {/* Framework */}
            <div className="space-y-1.5">
              <Label>Çerçeve</Label>
              <Select
                value={watch('framework')}
                onValueChange={(v) => setValue('framework', v as FormValues['framework'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Çerçeve seçin" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: 'PYTORCH', label: 'PyTorch' },
                    { value: 'TENSORFLOW', label: 'TensorFlow' },
                    { value: 'SKLEARN', label: 'Scikit-learn' },
                    { value: 'ONNX', label: 'ONNX' },
                    { value: 'JAX', label: 'JAX' },
                    { value: 'OTHER', label: 'Diğer' },
                  ].map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <Select
                value={watch('categoryId') ?? '_none'}
                onValueChange={(v) => setValue('categoryId', v === '_none' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Kategori yok</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label>Durum</Label>
              <Select
                value={watch('status')}
                onValueChange={(v) => setValue('status', v as FormValues['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Taslak</SelectItem>
                  <SelectItem value="PUBLISHED">Yayımlandı</SelectItem>
                  <SelectItem value="ARCHIVED">Arşivlendi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* License */}
            <div className="space-y-1.5">
              <Label htmlFor="license">Lisans</Label>
              <Input
                id="license"
                placeholder="MIT, Apache-2.0, CC-BY-4.0…"
                {...register('license')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags info (read-only chip list) */}
        {tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mevcut Etiketler</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Etiket atama API üzerinden yapılır — sonraki sürümde bu forma entegre edilecek.
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t.id}
                    className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" asChild>
            <Link href={ROUTES.MARKETPLACE}>İptal</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            {isSubmitting ? 'Yayımlanıyor…' : 'Modeli Yayımla'}
          </Button>
        </div>
      </form>
    </div>
  );
}
