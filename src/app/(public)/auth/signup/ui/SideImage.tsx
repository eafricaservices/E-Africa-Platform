import Image from "next/image";

export default function SideImage() {
    return (
        <div className="bg-[#26CD56] p-10 h-[80vh] rounded-2xl">
            <div className="flex justify-center items-center h-full">
                <Image
                    src="/side-image.png"
                    alt="Side Image"
                    width={300}
                    height={400}
                />
            </div>
        </div>
    );
}