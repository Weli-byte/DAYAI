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
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
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
      toast.success('Model created successfully');
      router.push(ROUTES.MODEL_DETAIL(model.id));
    } catch (err) {
      toast.error((err as Error)?.message ?? 'Failed to create model');
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2">
        <Link href={ROUTES.MARKETPLACE}>
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>
      </Button>

      {/* Page title */}
      <div className="flex items-center gap-3">
        <PlusCircle className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Publish AI Model</h1>
          <p className="text-sm text-muted-foreground">
            Register your AI model in the marketplace registry.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Model Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. CIFAR-10 ResNet Classifier"
                {...register('title')}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your model — architecture, training data, use-case, performance metrics…"
                rows={4}
                {...register('description')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Classification</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {/* Framework */}
            <div className="space-y-1.5">
              <Label>Framework</Label>
              <Select
                value={watch('framework')}
                onValueChange={(v) => setValue('framework', v as FormValues['framework'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: 'PYTORCH', label: 'PyTorch' },
                    { value: 'TENSORFLOW', label: 'TensorFlow' },
                    { value: 'SKLEARN', label: 'Scikit-learn' },
                    { value: 'ONNX', label: 'ONNX' },
                    { value: 'JAX', label: 'JAX' },
                    { value: 'OTHER', label: 'Other' },
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
              <Label>Category</Label>
              <Select
                value={watch('categoryId') ?? '_none'}
                onValueChange={(v) => setValue('categoryId', v === '_none' ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">No category</SelectItem>
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
              <Label>Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(v) => setValue('status', v as FormValues['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* License */}
            <div className="space-y-1.5">
              <Label htmlFor="license">License</Label>
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
              <CardTitle className="text-base">Available Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Tag assignment via the API — tag filter will be wired to this form in the next
                iteration.
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
            <Link href={ROUTES.MARKETPLACE}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            {isSubmitting ? 'Publishing…' : 'Publish Model'}
          </Button>
        </div>
      </form>
    </div>
  );
}
