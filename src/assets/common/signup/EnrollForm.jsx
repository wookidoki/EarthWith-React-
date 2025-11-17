import React, { useState } from 'react';
import { User, Lock, Mail, Phone, Image, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// InputField 컴포넌트 (RegisterPage 내부에 정의)
// RegisterPage의 state와 handler에 완벽하게 접근하도록 수정되었습니다.
const InputField = ({ label, icon: Icon, type = 'text', name, placeholder, error, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Icon className="w-4 h-4 mr-2 text-emerald-500" /> {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            required
            value={value} // ⭐ value 바인딩: 입력 상태를 화면에 반영
            onChange={onChange} // ⭐ onChange 핸들러: 상태를 업데이트
            className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-transparent'
            }`}
            placeholder={placeholder}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);


const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: '',
        profileImage: null,
    });
    
    // 유효성 검사 상태
    const [validation, setValidation] = useState({});

    // 1. handleChange 함수: name과 value를 사용하여 정확한 state를 업데이트합니다.
    const handleChange = (e) => {
        const { name, value } = e.target;
        // ⭐ 이 부분이 완벽하게 작동하도록 setFormData 로직 유지
        setFormData(prev => ({ ...prev, [name]: value }));
        setValidation(prev => ({ ...prev, [name]: '' }));
    };
    
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, profileImage: URL.createObjectURL(e.target.files[0]) }));
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const errors = {};
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }
        // TODO: 더 복잡한 유효성 검사 (아이디 중복 확인, 이메일 형식 등) 필요

        if (Object.keys(errors).length > 0) {
            setValidation(errors);
            return;
        }

        // TODO: (AXIOS) 서버에 회원가입 정보 전송 로직
        console.log('회원가입 정보 제출:', formData);
        
        // 성공 시 로그인 페이지로 리디렉션
        navigate('/signup');
    };


    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-emerald-600 transition"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> 로그인으로 돌아가기
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* 이미지 업로드 */}
                    <div className="flex flex-col items-center border-b pb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            <Image className="w-4 h-4 mr-2 inline text-emerald-500" /> 프로필 이미지 (선택)
                        </label>
                        <div 
                            className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 hover:border-emerald-500 transition-colors cursor-pointer relative group"
                            onClick={() => document.getElementById('profile-upload').click()}
                        >
                            {formData.profileImage ? (
                                <img src={formData.profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <User className="w-10 h-10" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-medium">업로드</span>
                            </div>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 이름 */}
                        <InputField 
                            label="이름" icon={User} name="name" placeholder="실명" 
                            value={formData.name} onChange={handleChange} 
                        />
                        
                        {/* 아이디 */}
                        <InputField 
                            label="아이디" icon={User} name="username" placeholder="사용할 아이디" 
                            value={formData.username} onChange={handleChange} 
                        />
                        
                        {/* 이메일 */}
                        <InputField 
                            label="이메일" icon={Mail} type="email" name="email" placeholder="example@email.com" 
                            value={formData.email} onChange={handleChange} 
                        />

                        {/* 휴대폰 번호 */}
                        <InputField 
                            label="휴대폰 번호" icon={Phone} name="phone" placeholder="010-1234-5678" 
                            value={formData.phone} onChange={handleChange} 
                        />
                        
                        {/* 비밀번호 */}
                        <InputField 
                            label="비밀번호" 
                            icon={Lock} 
                            type="password" 
                            name="password" 
                            placeholder="최소 8자 이상"
                            value={formData.password}
                            onChange={handleChange}
                            error={validation.password}
                        />
                        
                        {/* 비밀번호 확인 */}
                        <InputField 
                            label="비밀번호 확인" 
                            icon={Lock} 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="비밀번호 재입력"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={validation.confirmPassword}
                        />
                    </div>
                    
                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-bold transition-all mt-8"
                    >
                        <Send className="w-5 h-5 mr-2" /> 회원가입 완료
                    </button>
                    
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;