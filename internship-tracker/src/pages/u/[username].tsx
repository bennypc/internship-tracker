import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import ProfileBanner from '../../components/ProfileBanner';
import MainLayout from '../../components/Layout/MainLayout';

interface Profile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  backgroundImage: string;
  fields: [string, string][];
  bio: string;
  role: string;
  stats: {
    applicationsSubmitted: number;
    interviews: number;
    offers: number;
    rejections: number;
  };
  connections: {
    followers: string[];
    following: string[];
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) {
      console.log('Router is not ready yet.');
      return;
    }

    if (!username) {
      console.log('No username found in the query.');
      setLoading(false);
      return;
    }

    console.log('Router is ready, and username is:', username);

    const fetchProfile = async () => {
      try {
        console.log('Fetching profile from Firestore for username:', username);
        const q = query(
          collection(db, 'users'),
          where('displayName', '==', username)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          console.log('User found in Firestore.');
          const userSnapshot = querySnapshot.docs[0];
          const userData = userSnapshot.data();
          console.log('User data:', userData);
          setProfile({
            uid: userData.uid,
            name: userData.displayName,
            email: userData.email,
            avatar: userData.profile.photoURL,
            backgroundImage: userData.profile.bannerURL,
            fields: [
              ['Phone', userData.profile.phoneNumber],
              ['Email', userData.email],
              ['LinkedIn', userData.profile.linkedin],
              ['Website', userData.profile.website]
            ],
            bio: userData.profile.bio,
            role: userData.role,
            stats: {
              applicationsSubmitted: userData.stats.applicationsSubmitted,
              interviews: userData.stats.interviews,
              offers: userData.stats.offers,
              rejections: userData.stats.rejections
            },
            connections: {
              followers: userData.connections.followers,
              following: userData.connections.following
            }
          });
        } else {
          console.log('No user found with that username.');
          setProfile(null);
        }
      } catch (error) {
        console.error('Error getting document:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router.isReady, router.query]);

  console.log('Loading state:', loading);
  console.log('Profile state:', profile);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <MainLayout
      mainContent={<ProfileBanner profile={profile} />}
      asideContent={
        <div>
          <h2 className='text-xl font-bold'>User Stats</h2>
          <ul>
            <li>
              Applications Submitted: {profile.stats.applicationsSubmitted}
            </li>
            <li>Interviews: {profile.stats.interviews}</li>
            <li>Offers: {profile.stats.offers}</li>
            <li>Rejections: {profile.stats.rejections}</li>
          </ul>
          <h2 className='text-xl font-bold mt-4'>Connections</h2>
          <ul>
            <li>Followers: {profile.connections.followers.length}</li>
            <li>Following: {profile.connections.following.length}</li>
          </ul>
        </div>
      }
    />
  );
}
