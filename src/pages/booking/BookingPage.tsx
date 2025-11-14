import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, User, MapPin, Phone, Mail } from 'lucide-react';

const theme = {
  colors: {
    primary: "#dc2626",
    primaryDark: "#b91c1c",
    backgroundLight: "#f6f7f8",
    textDark: "#1f2937",
    textLight: "#6b7280",
    white: "#ffffff",
    border: "#e6e7ea",
    success: "#10b981",
    successLight: "#d1fae5",
    error: "#ef4444",
    errorLight: "#fee2e2",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    md: "0 6px 18px rgba(0,0,0,0.06)",
    lg: "0 10px 30px rgba(0,0,0,0.10)",
    xl: "0 20px 40px rgba(0,0,0,0.12)",
  },
};

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 3rem 1rem;
`;

const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: ${theme.colors.white};
  border-radius: 16px;
  box-shadow: ${theme.shadows.xl};
  padding: 2.5rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  border-radius: 20px;
  margin-bottom: 1.5rem;
  box-shadow: ${theme.shadows.lg};
  
  svg {
    width: 40px;
    height: 40px;
    color: ${theme.colors.white};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.textDark};
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${theme.colors.textLight};
  margin: 0;
`;

const MessageBox = styled.div<{ $type: 'success' | 'error' }>`
  padding: 1rem 1.25rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  background: ${p => p.$type === 'success' ? theme.colors.successLight : theme.colors.errorLight};
  color: ${p => p.$type === 'success' ? theme.colors.success : theme.colors.error};
  border: 1px solid ${p => p.$type === 'success' ? theme.colors.success : theme.colors.error};
  font-weight: 500;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.textDark};
  
  span {
    color: ${theme.colors.primary};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: ${theme.colors.textLight};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: ${p => p.type === 'date' || p.type === 'datetime-local' ? '1rem' : '3rem'};
  border: 2px solid ${theme.colors.border};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
  
  &:read-only {
    background: ${theme.colors.backgroundLight};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: 3rem;
  border: 2px solid ${theme.colors.border};
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const GenderLabel = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 2px solid ${p => p.$selected ? theme.colors.primary : theme.colors.border};
  border-radius: 10px;
  background: ${p => p.$selected ? 'rgba(220, 38, 38, 0.05)' : theme.colors.white};
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
  
  input {
    display: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: ${theme.colors.white};
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${theme.shadows.md};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BookingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    address: '',
    phoneNumber: '',
    email: '',
    appointmentDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    setFormData({
      ...formData,
      dateOfBirth: dob,
      age: calculateAge(dob),
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.fullName || !formData.dateOfBirth || !formData.gender || 
        !formData.address || !formData.phoneNumber || !formData.email || 
        !formData.appointmentDate) {
      setMessage({
        type: 'error',
        text: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, replace with actual Supabase call:
      // const { error } = await supabase.from('blood_test_appointments').insert([{
      //   full_name: formData.fullName,
      //   date_of_birth: formData.dateOfBirth,
      //   age: parseInt(formData.age),
      //   gender: formData.gender,
      //   address: formData.address,
      //   phone_number: formData.phoneNumber,
      //   email: formData.email,
      //   appointment_date: formData.appointmentDate,
      // }]);
      
      console.log('Form data:', formData);
      
      setMessage({
        type: 'success',
        text: 'Đăng ký xét nghiệm thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
      });
      
      setFormData({
        fullName: '',
        dateOfBirth: '',
        age: '',
        gender: '',
        address: '',
        phoneNumber: '',
        email: '',
        appointmentDate: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <FormWrapper>
        <Header>
          <IconWrapper>
            <Calendar />
          </IconWrapper>
          <Title>Đặt Lịch Xét Nghiệm Máu</Title>
          <Subtitle>Vui lòng điền đầy đủ thông tin để đăng ký lịch xét nghiệm</Subtitle>
        </Header>

        {message && (
          <MessageBox $type={message.type}>
            {message.text}
          </MessageBox>
        )}

        <FormContainer>
          <FormGroup>
            <Label>
              Họ và tên <span>*</span>
            </Label>
            <InputWrapper>
              <User />
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nhập họ và tên"
              />
            </InputWrapper>
          </FormGroup>

          <GridRow>
            <FormGroup>
              <Label>
                Ngày sinh <span>*</span>
              </Label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={handleDateOfBirthChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>

            <FormGroup>
              <Label>Tuổi</Label>
              <Input
                type="number"
                readOnly
                value={formData.age}
                placeholder="Tự động tính"
              />
            </FormGroup>
          </GridRow>

          <FormGroup>
            <Label>
              Giới tính <span>*</span>
            </Label>
            <GenderGrid>
              {['Nam', 'Nữ', 'Khác'].map((gender) => (
                <GenderLabel key={gender} $selected={formData.gender === gender}>
                  <input
                    type="radio"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  />
                  <span>{gender}</span>
                </GenderLabel>
              ))}
            </GenderGrid>
          </FormGroup>

          <FormGroup>
            <Label>
              Địa chỉ <span>*</span>
            </Label>
            <InputWrapper>
              <MapPin style={{ top: '1rem', transform: 'none' }} />
              <TextArea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                placeholder="Nhập địa chỉ đầy đủ"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>
              Số điện thoại <span>*</span>
            </Label>
            <InputWrapper>
              <Phone />
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Nhập số điện thoại"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>
              Email <span>*</span>
            </Label>
            <InputWrapper>
              <Mail />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Nhập email"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>
              Ngày giờ xét nghiệm <span>*</span>
            </Label>
            <Input
              type="datetime-local"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              min={new Date().toISOString().slice(0, 16)}
            />
          </FormGroup>

          <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký xét nghiệm'}
          </SubmitButton>
        </FormContainer>
      </FormWrapper>
    </PageContainer>
  );
};

export default BookingPage;