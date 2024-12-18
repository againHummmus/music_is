import Image from "next/image";
import logo from '@public/images/logoDark.png';
import HugeiconsSearch01 from '~icons/hugeicons/search-01';
import placeholderAvatar from '@public/images/placeholderAvatar.png';

export async function Header() {

    return (
        <header
            id='header'
            className="w-full fixed z-[1000] left-0 top-0 h-[40px] tablet:h-[65px] flex flex-row bg-mainWhite/80 backdrop-blur-sm justify-center border-b border-lightStormy"
        >
            <div className="container p-[5px] tablet:p-[20px] flex flex-row justify-between">
                <Image src={logo} width={200} height={40} alt={"logo"} className="object-contain h-[25px] w-[90px]"/>
                <div className="flex flex-row gap-[30px] items-center">
                    <HugeiconsSearch01 className="text-mainOrange transition-all cursor-pointer" />
                    <Image src={placeholderAvatar} width={40} height={40} alt={"avatar"} className="rounded-full object-cover aspect-square h-[30px] w-[30px] tablet:h-[40px] tablet:w-[40px] cursor-pointer"/>
                </div>
            </div>
        </header>
    );
}
