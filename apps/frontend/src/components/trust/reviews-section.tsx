'use client';

import { useState } from 'react';
import { Star, MessageSquare, Trash2, Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useWalletStore } from '@/store/wallet.store';
import {
  useReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useRatingSummary,
  useRateModel,
  useUserRating,
} from '@/hooks/use-trust';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewsSectionProps {
  modelId: string;
}

export function ReviewsSection({ modelId }: ReviewsSectionProps) {
  const { address, isConnected } = useWalletStore();
  const [page, setPage] = useState(1);
  const [content, setContent] = useState('');
  const [ratingVal, setRatingVal] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Editing state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Queries
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews(modelId, page, 5);
  const { data: ratingSummary, isLoading: ratingSummaryLoading } = useRatingSummary(modelId);
  const { data: userRatingData } = useUserRating(modelId, address || '');

  // Mutations
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview(modelId);
  const rateMutation = useRateModel();

  const handleRate = async (val: number) => {
    if (!isConnected || !address) {
      toast.error('Connect your wallet to submit a rating');
      return;
    }
    try {
      await rateMutation.mutateAsync({
        modelId,
        walletAddress: address,
        value: val,
      });
      setRatingVal(val);
      toast.success('Rating submitted successfully');
    } catch {
      toast.error('Failed to submit rating');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      toast.error('Connect your wallet to submit a review');
      return;
    }
    if (content.trim().length < 3) {
      toast.error('Review must be at least 3 characters long');
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        modelId,
        walletAddress: address,
        content: content.trim(),
      });
      setContent('');
      toast.success('Review published successfully');
    } catch {
      toast.error('Failed to submit review');
    }
  };

  const handleEditSubmit = async (id: string) => {
    if (!address) return;
    if (editContent.trim().length < 3) {
      toast.error('Review must be at least 3 characters long');
      return;
    }

    try {
      await updateReviewMutation.mutateAsync({
        id,
        payload: {
          walletAddress: address,
          content: editContent.trim(),
        },
      });
      setEditingReviewId(null);
      toast.success('Review updated successfully');
    } catch {
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!address) return;
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReviewMutation.mutateAsync({
        id,
        walletAddress: address,
      });
      toast.success('Review deleted successfully');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const activeRating = ratingVal || userRatingData?.value || 0;

  return (
    <div className="space-y-6">
      {/* ── Ratings & Stats Summary ── */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 flex flex-col justify-center items-center p-6 text-center">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2">
            {ratingSummaryLoading ? (
              <Skeleton className="h-10 w-24 mx-auto" />
            ) : (
              <div className="text-5xl font-extrabold text-foreground">
                {ratingSummary?.average || '0.0'}
              </div>
            )}
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-5 w-5',
                    star <= (ratingSummary?.average || 0)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-muted',
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {ratingSummaryLoading
                ? 'Loading votes...'
                : `Based on ${ratingSummary?.count || 0} reviews`}
            </p>
          </CardContent>
        </Card>

        {/* ── User Rating Submission ── */}
        <Card className="md:col-span-2 p-6 flex flex-col justify-center">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-base font-semibold">Your Rating</CardTitle>
            <CardDescription className="text-xs">
              {isConnected
                ? 'Select stars to submit or update your rating for this model.'
                : 'Please connect your wallet to rate this model.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={!isConnected}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={cn(
                      'transition-transform hover:scale-110 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
                      !isConnected && 'cursor-not-allowed',
                    )}
                  >
                    <Star
                      className={cn(
                        'h-8 w-8 transition-colors',
                        star <= (hoverRating || activeRating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-muted hover:text-yellow-500',
                      )}
                    />
                  </button>
                ))}
              </div>
              {activeRating > 0 && (
                <span className="text-sm font-semibold text-muted-foreground">
                  ({activeRating} / 5 stars)
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Write Review Form ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <Textarea
                placeholder="Share your experience using this AI model. What worked well? How is the latency and token precision?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
                maxLength={1000}
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{content.length}/1000 characters</span>
                <Button
                  type="submit"
                  disabled={createReviewMutation.isPending || content.trim().length < 3}
                  className="gap-2"
                >
                  {createReviewMutation.isPending ? 'Publishing...' : 'Publish Review'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm text-amber-600 dark:text-amber-400">
                  Wallet Connection Required
                </h5>
                <p className="text-xs text-muted-foreground mt-1">
                  You must connect your Web3 wallet to write comments and evaluate models.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Reviews List ── */}
      <div className="space-y-4">
        <h4 className="font-bold text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Reviews ({reviewsData?.total || 0})
        </h4>

        {reviewsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviewsData?.items && reviewsData.items.length > 0 ? (
          <div className="space-y-3">
            {reviewsData.items.map((review) => {
              const isOwner =
                isConnected &&
                address &&
                review.user.walletAddress?.toLowerCase() === address.toLowerCase();

              const isEditing = editingReviewId === review.id;

              return (
                <Card key={review.id} className="transition-all hover:border-primary/20">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary overflow-hidden">
                          {review.user.avatar ? (
                            <div
                              style={{ backgroundImage: `url(${review.user.avatar})` }}
                              className="h-full w-full bg-cover bg-center"
                            />
                          ) : (
                            review.user.username.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {review.user.username}
                            </span>
                            {review.user.walletAddress && (
                              <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {review.user.walletAddress.substring(0, 6)}...
                                {review.user.walletAddress.substring(
                                  review.user.walletAddress.length - 4,
                                )}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      {isOwner && !isEditing && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setEditingReviewId(review.id);
                              setEditContent(review.content);
                            }}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive/80"
                            onClick={() => handleDelete(review.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    {isEditing ? (
                      <div className="space-y-3 pt-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingReviewId(null)}
                            className="h-8 text-xs gap-1"
                          >
                            <X className="h-3.5 w-3.5" /> Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEditSubmit(review.id)}
                            className="h-8 text-xs gap-1"
                          >
                            <Check className="h-3.5 w-3.5" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {review.content}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Pagination */}
            {reviewsData.totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-xs self-center text-muted-foreground">
                  Page {page} of {reviewsData.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === reviewsData.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="p-8 text-center border-dashed">
            <CardContent className="space-y-3 pt-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <h5 className="font-semibold text-sm">No reviews yet</h5>
              <p className="text-xs text-muted-foreground">
                Be the first to share your thoughts about this AI model.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
