import { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrderCommentsByOrderDetailId, type OrderCommentResponse } from "../../api/apiOrderComment";
import LoadingSpinner from "../common/LoadingSpinner";

/* ---------- Styled Components ---------- */

const CommentSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 0.75rem;
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

const CommentContent = styled.div`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

/* ---------- Component ---------- */

interface PatientOrderCommentProps {
  orderDetailId: number;
}

export default function PatientOrderComment({ orderDetailId }: PatientOrderCommentProps) {
  const [comments, setComments] = useState<OrderCommentResponse[]>([]);
  const [loading, setLoading] = useState(false);

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
      // 404 is normal when no comments exist
      if (error.response?.status === 404) {
        setComments([]);
      } else {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <CommentSection>
        <SectionTitle>
          💬 Bình luận từ bác sĩ
        </SectionTitle>
        <LoadingContainer>
          <LoadingSpinner text="Đang tải bình luận..." />
        </LoadingContainer>
      </CommentSection>
    );
  }

  return (
    <CommentSection>
      <SectionTitle>
        💬 Bình luận từ bác sĩ
        {comments.length > 0 && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#6b7280',
            marginLeft: '0.5rem'
          }}>
            ({comments.length})
          </span>
        )}
      </SectionTitle>
      
      {comments.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💭</div>
          <div>Chưa có bình luận từ bác sĩ</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#9ca3af' }}>
            Bác sĩ sẽ thêm bình luận sau khi hoàn thành xét nghiệm
          </div>
        </EmptyState>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment.orderCommentId}>
            <CommentHeader>
              <div>
                <CommentAuthor>👨‍⚕️ {comment.labUserName}</CommentAuthor>
                <CommentDate>
                  {formatDate(comment.createdAt)}
                  {comment.updatedAt !== comment.createdAt && " (đã chỉnh sửa)"}
                </CommentDate>
              </div>
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>
          </CommentCard>
        ))
      )}
    </CommentSection>
  );
}

