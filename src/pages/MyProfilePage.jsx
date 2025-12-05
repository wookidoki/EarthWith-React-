import React, { useState, useEffect} from 'react';
import ProfileHeader from './ProfileHeader';
import TabMenu from './TabMenu';
import ActivitySection from './ActivitySection';
import PointHistory from './PointHistory';
import AccountSettings from './AccountSettings';
import { useAuth} from '../context/AuthContext';

const MyProfilePage = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState('activity');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    likes: 0,
    bookmarks: 0
  });

  useEffect(() => {
    console.log('===== MyProfilePage 디버깅 =====');
    console.log('auth 객체:', auth);
    console.log('auth.isAuthenticated:', auth.isAuthenticated);
    console.log('auth.memberNo:', auth.memberNo);
    console.log('auth.memberName:', auth.memberName);
    console.log('auth.email:', auth.email);
    
    // ⭐ 방법 1: auth에서 직접 가져오기
    if (auth.isAuthenticated && auth.memberNo) {
      const userData = {
        memberNo: auth.memberNo,
        memberName: auth.memberName,
        email: auth.email,
        phone: auth.phone,
        memberPoint: auth.memberPoint,
        memberImage: auth.memberImage,
        enrollDate: auth.enrollDate
      };
      
      console.log('✅ auth에서 사용자 데이터 설정:', userData);
      setUser(userData);
    } 
    // ⭐ 방법 2: localStorage에서 가져오기 (백업)
    else {
      const memberNo = localStorage.getItem('memberNo');
      const memberName = localStorage.getItem('memberName');
      const email = localStorage.getItem('email');
      
      console.log('localStorage 데이터:', { memberNo, memberName, email });
      
      if (memberNo) {
        const userData = {
          memberNo: memberNo,
          memberName: memberName || '사용자',
          email: email || 'email@example.com',
          phone: localStorage.getItem('phone') || '010-0000-0000',
          memberPoint: parseInt(localStorage.getItem('memberPoint')) || 0,
          memberImage: localStorage.getItem('memberImage'),
          enrollDate: localStorage.getItem('enrollDate') || '2024.01.15'
        };
        
        console.log('✅ localStorage에서 사용자 데이터 설정:', userData);
        setUser(userData);
      } else {
        console.error('❌ memberNo를 찾을 수 없습니다.');
      }
    }
    
    fetchUserStats();
  }, [auth]);

  const fetchUserStats = async () => {
    try {
      const memberNo = auth.memberNo || localStorage.getItem('memberNo');
      
      if (!memberNo) {
        console.error('통계 로드 실패: memberNo가 없습니다.');
        return;
      }

      console.log('📊 통계 로드 중... memberNo:', memberNo);
      
      const [postsRes, commentsRes, likesRes, bookmarksRes] = await Promise.all([
        fetch(`http://localhost:8081/members/posts?memberNo=${memberNo}&page=1`),
        fetch(`http://localhost:8081/members/comments?memberNo=${memberNo}&page=1`),
        fetch(`http://localhost:8081/members/likes?memberNo=${memberNo}&page=1`),
        fetch(`http://localhost:8081/members/bookmarks?memberNo=${memberNo}&page=1`)
      ]);

      const [postsData, commentsData, likesData, bookmarksData] = await Promise.all([
        postsRes.json(),
        commentsRes.json(),
        likesRes.json(),
        bookmarksRes.json()
      ]);

      const newStats = {
        posts: postsData.pageInfo?.listCount || 0,
        comments: commentsData.pageInfo?.listCount || 0,
        likes: likesData.pageInfo?.listCount || 0,
        bookmarks: bookmarksData.pageInfo?.listCount || 0
      };

      console.log('✅ 통계 로드 완료:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('❌ 통계 로드 실패:', error);
    }
  };

  // ⭐ 디버깅: user 상태 변경 시 로그
  useEffect(() => {
    console.log('👤 user 상태 업데이트:', user);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-28">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 디버깅 정보 (임시) */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <p className="font-bold mb-2">🔍 디버깅 정보</p>
          <p><strong>user 객체:</strong> {user ? '✅ 있음' : '❌ 없음'}</p>
          <p><strong>memberName:</strong> {user?.memberName || '없음'}</p>
          <p><strong>email:</strong> {user?.email || '없음'}</p>
          <p><strong>memberPoint:</strong> {user?.memberPoint || 0}</p>
          <p><strong>auth.isAuthenticated:</strong> {auth.isAuthenticated ? '✅ true' : '❌ false'}</p>
          <p><strong>localStorage.memberNo:</strong> {localStorage.getItem('memberNo') || '없음'}</p>
        </div>

        {/* 프로필 헤더 */}
        <ProfileHeader user={user} stats={stats} />
        
        {/* 탭 메뉴 */}
        <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* 컨텐츠 영역 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {activeTab === 'activity' && <ActivitySection stats={stats} setStats={setStats} />}
          {activeTab === 'points' && <PointHistory currentUser={user} />}
          {activeTab === 'settings' && <AccountSettings currentUser={user} />}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;