import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getOrderCommentsByOrderDetailId,
  createOrderComment,
  updateOrderComment,
  deleteOrderComment,
  type OrderCommentResponse,
  type CreateOrderCommentRequest,
  type UpdateOrderCommentRequest,
} from "../../api/apiOrderComment";
import LoadingSpinner from "../common/LoadingSpinner";

/* ---------- Types ---------- */

interface OrderCommentSectionProps {
  orderDetailId: number;
}

/* ---------- Styled Components ---------- */

const CommentSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: #dc2626;
  color: white;

  &:hover:not(:disabled) {
    background: #b91c1c;
  }
`;

const SecondaryButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;

  &:hover:not(:disabled) {
    background: #e5e7eb;
  }
`;

const DangerButton = styled(Button)`
  background: #ef4444;
  color: white;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;

  &:hover:not(:disabled) {
    background: #dc2626;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const CommentDate = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CommentContent = styled.div`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: -0.5rem;
`;

const EmptyState = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  background: #f9fafb;
  border-radius: 0.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

/* ---------- Component ---------- */

export default function OrderCommentSection({ orderDetailId }: OrderCommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<OrderCommentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderDetailId) {
      fetchComments();
    }
  }, [orderDetailId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getOrderCommentsByOrderDetailId(orderDetailId);
      setComments(data);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      toast.error("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError("Nội dung bình luận không được để trống");
      return;
    }

    if (!user?.id) {
      toast.error("Bạn cần đăng nhập để thêm bình luận");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const request: CreateOrderCommentRequest = {
        orderDetailId,
        labUserId: user.id,
        content: newComment.trim(),
      };

      await createOrderComment(request);
      toast.success("Thêm bình luận thành công!");
      setNewComment("");
      await fetchComments();
    } catch (error: any) {
      console.error("Error creating comment:", error);
      const errorMessage = error.response?.data?.message || "Không thể thêm bình luận";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (comment: OrderCommentResponse) => {
    setEditingId(comment.orderCommentId);
    setEditContent(comment.content);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
    setError("");
  };

  const handleSubmitEdit = async (e: React.FormEvent, commentId: number) => {
    e.preventDefault();

    if (!editContent.trim()) {
      setError("Nội dung bình luận không được để trống");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const request: UpdateOrderCommentRequest = {
        content: editContent.trim(),
      };

      await updateOrderComment(commentId, request);
      toast.success("Cập nhật bình luận thành công!");
      setEditingId(null);
      setEditContent("");
      await fetchComments();
    } catch (error: any) {
      console.error("Error updating comment:", error);
      const errorMessage = error.response?.data?.message || "Không thể cập nhật bình luận";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      return;
    }

    try {
      setSubmitting(true);
      await deleteOrderComment(commentId);
      toast.success("Xóa bình luận thành công!");
      await fetchComments();
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      const errorMessage = error.response?.data?.message || "Không thể xóa bình luận";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const canEditOrDelete = (comment: OrderCommentResponse) => {
    return user?.id === comment.labUserId;
  };

  if (loading) {
    return (
      <CommentSection>
        <SectionTitle>Bình luận</SectionTitle>
        <LoadingContainer>
          <LoadingSpinner text="Đang tải bình luận..." />
        </LoadingContainer>
      </CommentSection>
    );
  }

  return (
    <CommentSection>
      <SectionTitle>Bình luận</SectionTitle>

      {/* Add New Comment Form */}
      <CommentForm onSubmit={handleSubmitNewComment}>
        <TextArea
          value={newComment}
          onChange={(e) => {
            setNewComment(e.target.value);
            setError("");
          }}
          placeholder="Thêm bình luận về chi tiết đơn hàng này..."
          disabled={submitting}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <PrimaryButton type="submit" disabled={submitting || !newComment.trim()}>
          {submitting ? "Đang thêm..." : "Thêm bình luận"}
        </PrimaryButton>
      </CommentForm>

      {/* Comments List */}
      {comments.length === 0 ? (
        <EmptyState>Chưa có bình luận nào</EmptyState>
      ) : (
        <CommentsList>
          {comments.map((comment) => (
            <CommentCard key={comment.orderCommentId}>
              {editingId === comment.orderCommentId ? (
                <EditForm onSubmit={(e) => handleSubmitEdit(e, comment.orderCommentId)}>
                  <TextArea
                    value={editContent}
                    onChange={(e) => {
                      setEditContent(e.target.value);
                      setError("");
                    }}
                    disabled={submitting}
                  />
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <PrimaryButton type="submit" disabled={submitting || !editContent.trim()}>
                      {submitting ? "Đang lưu..." : "Lưu"}
                    </PrimaryButton>
                    <SecondaryButton
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={submitting}
                    >
                      Hủy
                    </SecondaryButton>
                  </div>
                </EditForm>
              ) : (
                <>
                  <CommentHeader>
                    <div>
                      <CommentAuthor>{comment.labUserName}</CommentAuthor>
                      <CommentDate>
                        {formatDate(comment.createdAt)}
                        {comment.updatedAt !== comment.createdAt && " (đã chỉnh sửa)"}
                      </CommentDate>
                    </div>
                    {canEditOrDelete(comment) && (
                      <CommentActions>
                        <SecondaryButton
                          type="button"
                          onClick={() => handleStartEdit(comment)}
                          disabled={submitting}
                        >
                          Sửa
                        </SecondaryButton>
                        <DangerButton
                          type="button"
                          onClick={() => handleDelete(comment.orderCommentId)}
                          disabled={submitting}
                        >
                          Xóa
                        </DangerButton>
                      </CommentActions>
                    )}
                  </CommentHeader>
                  <CommentContent>{comment.content}</CommentContent>
                </>
              )}
            </CommentCard>
          ))}
        </CommentsList>
      )}
    </CommentSection>
  );
}

