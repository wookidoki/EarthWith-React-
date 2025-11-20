import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, Image, ArrowLeft, Send, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// API 기본 URL
const API_BASE_URL = 'http://localhost:8081';

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
            value={value}
            onChange={onChange}
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

    // 폼 입력 데이터 상태
    const [formData, setFormData] = useState({
        name: '',
        userid: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: '',
        refRno: '',
    });

    // 파일 및 유효성 검사 상태
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [validation, setValidation] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // 폼 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setValidation(prev => ({ ...prev, [name]: '' }));
    };

    // 이미지 파일 변경 핸들러
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImageFile(file);

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // 컴포넌트 언마운트 시 미리보기 URL 메모리 해제
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 프론트엔드 유효성 검사
        const errors = {};
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }
        if (!formData.refRno) {
            errors.refRno = '지역을 선택해주세요.';
        }

        if (Object.keys(errors).length > 0) {
            setValidation(errors);
            return;
        }

        setIsLoading(true);
        setValidation({});

        const enrollData = new FormData();

        enrollData.append('memberName', formData.name);
        enrollData.append('memberId', formData.userid);
        enrollData.append('memberPwd', formData.password);
        enrollData.append('phone', formData.phone);
        enrollData.append('email', formData.email);
        enrollData.append('refRno', formData.refRno);
        
        // 프로필 이미지 추가
        if (profileImageFile) {
            enrollData.append('profileImg', profileImageFile);
        }

        // API 호출
        try {
            const response = await fetch(`${API_BASE_URL}/members`, {
                method: 'POST',
                body: enrollData,
            });

            // 응답 처리
            if (!response.ok) {
                const errorText = await response.text();
                let errorData = { message: `서버 오류 (HTTP ${response.status}): ${errorText || '응답 없음'}` };

                try {
                    errorData = JSON.parse(errorText);
                } catch (jsonError) {
                    console.warn("서버가 JSON이 아닌 오류를 반환했습니다:", errorText);
                }

                // Spring Valid 오류 처리
                if (errorData.errors) {
                    const serverErrors = {};
                    errorData.errors.forEach(err => {
                        // 서버 필드명을 프론트 필드명으로 매핑
                        const fieldMap = {
                            'memberName': 'name',
                            'memberId': 'userid',
                            'memberPwd': 'password',
                            'phone': 'phone',
                            'email': 'email',
                            'refRno': 'refRno'
                        };
                        const frontendField = fieldMap[err.field] || err.field;
                        serverErrors[frontendField] = err.defaultMessage;
                    });
                    setValidation(serverErrors);
                    throw new Error('입력 값을 확인해주세요.');
                }

                throw new Error(errorData.message || '회원가입에 실패했습니다.');
            }

            console.log('회원가입 성공');
            navigate('/login');

        } catch (error) {
            console.error('회원가입 오류:', error.message);
            if (error.message !== '입력 값을 확인해주세요.') {
                setValidation(prev => ({ ...prev, apiError: error.message }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 렌더링
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

                {/* 헤더 */}
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
                    <button
                        onClick={() => navigate('/login')}
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
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
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

                    {/* 입력 필드 그리드 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="이름" 
                            icon={User} 
                            name="name" 
                            placeholder="실명"
                            value={formData.name} 
                            onChange={handleChange}
                            error={validation.name}
                        />

                        <InputField
                            label="아이디" 
                            icon={User} 
                            name="userid" 
                            placeholder="사용할 아이디"
                            value={formData.userid} 
                            onChange={handleChange}
                            error={validation.userid}
                        />

                        <InputField
                            label="이메일" 
                            icon={Mail} 
                            type="email" 
                            name="email" 
                            placeholder="example@email.com"
                            value={formData.email} 
                            onChange={handleChange}
                            error={validation.email}
                        />

                        <InputField
                            label="휴대폰 번호" 
                            icon={Phone} 
                            name="phone" 
                            placeholder="010-1234-5678"
                            value={formData.phone} 
                            onChange={handleChange}
                            error={validation.phone}
                        />

                        {/* 지역 선택 드롭다운 */}
                        <div>
                            <label htmlFor="refRno" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-emerald-500" /> 지역
                            </label>
                            <select
                                id="refRno"
                                name="refRno"
                                value={formData.refRno}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                                    validation.refRno ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-transparent'
                                }`}
                            >
                                <option value="" disabled>지역을 선택하세요</option>
                                <option value="1">서울</option>
                                <option value="2">부산</option>
                                <option value="10">경기도</option>
                            </select>
                            {validation.refRno && <p className="mt-1 text-xs text-red-500">{validation.refRno}</p>}
                        </div>

                        <InputField
                            label="비밀번호"
                            icon={Lock}
                            type="password"
                            name="password"
                            placeholder="최소 6자 이상 (영문 소문자/숫자 포함)"
                            value={formData.password}
                            onChange={handleChange}
                            error={validation.password}
                        />

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

                    {/* API 서버 에러 메시지 표시 */}
                    {validation.apiError && (
                        <div className="text-center text-red-500 font-medium p-3 bg-red-50 rounded-lg">
                            {validation.apiError}
                        </div>
                    )}

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-bold transition-all mt-8 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                처리 중...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 mr-2" /> 회원가입 완료
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default RegisterPage;