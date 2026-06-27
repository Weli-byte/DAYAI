import Link from 'next/link';
import { Brain, Calendar, Tag, ArrowRight, Play } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import type { ModelDto, Framework } from '@/types/model';

// ── Framework colour mapping ───────────────────────────────────────────────────
const FRAMEWORK_COLORS: Record<Framework, string> = {
  PYTORCH: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  TENSORFLOW: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  SKLEARN: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  ONNX: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  JAX: 'bg-green-500/10 text-green-600 dark:text-green-400',
  OTHER: 'bg-muted text-muted-foreground',
};

const FRAMEWORK_LABELS: Record<Framework, string> = {
  PYTORCH: 'PyTorch',
  TENSORFLOW: 'TensorFlow',
  SKLEARN: 'Scikit-learn',
  ONNX: 'ONNX',
  JAX: 'JAX',
  OTHER: 'Other',
};

interface ModelCardProps {
  model: ModelDto;
}

export function ModelCard({ model }: ModelCardProps) {
  const detailHref = ROUTES.MODEL_DETAIL(model.id);
  const latestVersion = model.latestVersion?.version ?? '—';
  const updatedAt = new Date(model.updatedAt).toLocaleDateString('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="group flex flex-col overflow-hidden border-border/60 transition-all hover:border-primary/40 hover:shadow-md">
      {/* Framework accent bar */}
      <div className={`h-1 w-full ${FRAMEWORK_COLORS[model.framework].split(' ')[0]}`} />

      <CardHeader className="pb-2 pt-4">
        {/* Framework + Category */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${FRAMEWORK_COLORS[model.framework]}`}
          >
            {FRAMEWORK_LABELS[model.framework]}
          </span>
          {model.category && (
            <Badge variant="outline" className="text-[11px]">
              {model.category.name}
            </Badge>
          )}
        </div>

        {/* Title */}
        <Link href={detailHref} className="mt-1 block">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
            {model.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {model.description && (
          <p className="line-clamp-2 text-[13px] text-muted-foreground">{model.description}</p>
        )}

        {/* Tags */}
        {model.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            <Tag className="h-3 w-3 text-muted-foreground mt-0.5" />
            {model.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag.name}
              </span>
            ))}
            {model.tags.length > 4 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                +{model.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-border/60 px-4 py-3">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Brain className="h-3 w-3" />v{latestVersion}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {updatedAt}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {model.status === 'PUBLISHED' && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 text-[11px] px-2.5 font-medium border-primary/20 text-primary hover:bg-primary/5"
                asChild
              >
                <Link href={`${detailHref}?tab=playground`}>
                  <Play className="h-3 w-3 fill-current" />
                  Çalıştır
                </Link>
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-8 gap-1 text-[11px] px-2.5" asChild>
              <Link href={detailHref}>
                Detaylar
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
