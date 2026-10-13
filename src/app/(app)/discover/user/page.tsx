import { searchUsers } from '@/actions/userApi';
import { UsersScreen } from '@/screens/users/UsersScreen';

const PAGE_SIZE = 20;

export default async function Page() {
  const initialUsers = await searchUsers({ limit: PAGE_SIZE });

  return <UsersScreen initialUsers={initialUsers} pageSize={PAGE_SIZE} />;
}
