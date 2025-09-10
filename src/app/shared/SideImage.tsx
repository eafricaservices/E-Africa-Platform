import Image from "next/image";

export default function SideImage() {
    return (
        <div className="bg-[#26CD56] p-10 rounded-2xl h-full flex justify-center items-center">
            <div className="">
                <Image
                    src="/side-image.png"
                    alt="Side Image"
                    width={250}
                    height={400}
                />
            </div>
        </div>
    );
}