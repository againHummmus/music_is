import HugeiconsDelete02 from "~icons/hugeicons/delete-02?width=20px&height=20px";
import Image from "next/image";
import { createImgUrl } from "../utils/createUrlFromHash";

export const PostItem = ({ user, isCurrentUser, post, handleDeletePost }: { user: User, isCurrentUser: boolean, post: any, handleDeletePost: (id: any) => void }) => {

    return (
        <div key={post.id} className="flex flex-row gap-10 bg-white p-4 rounded-lg shadow-sm relative">
            <Image
                src={
                    user.avatar_url
                        ? createImgUrl(user.avatar_url)
                        : "/images/placeholderAvatar.jpg"
                }
                alt="User avatar"
                width={200}
                height={200}
                className="w-[60px] h-[60px] main:w-[60px] main:h-[60px] object-cover rounded-[7px]"
            />
            <div className='flex flex-col'>
                <div className="text-sm text-gray-500">
                    <span className='text-mainOrange font-medium'>{user?.username}</span> <span className='opacity-70'>{` ∘ ${new Date(post.created_at).toLocaleString()}`}</span>
                </div>
                <div className="text-base text-gray-800">{post.content}</div>
            </div>
            {isCurrentUser && (
                <button
                    onClick={() => handleDeletePost(post.id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                    <HugeiconsDelete02 />
                </button>
            )}
        </div>
    )
}