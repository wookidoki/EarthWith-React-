import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ memberId: '', memberPwd: '' });
  const [errors, setErrors] = useState({ id: '', pwd: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, id: '', pwd: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { memberId, memberPwd } = credentials;
    const regexp = /^[a-zA-Z0-9]{2,40}$/;

    if (!regexp.test(memberId)) {
      setErrors(prev => ({ ...prev, id: "아이디 형식이 올바르지 않습니다." }));
      return;
    }

    try {
      const result = await axios.post(`${API_BASE_URL}/auth/login`, { memberId, memberPwd });
      const { memberNo, role, memberImage, phone, refRno, memberName, accessToken, enrollDate, email, refreshToken, memberPoint } = result.data;
      
      login(memberNo, role, memberImage, phone, refRno, memberName, accessToken, enrollDate, email, refreshToken, memberId, memberPoint);
      alert("로그인 성공");
      navigate("/main");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.["error-message"] || "로그인 실패");
    }
  };

  return { credentials, errors, handleChange, handleSubmit };
};