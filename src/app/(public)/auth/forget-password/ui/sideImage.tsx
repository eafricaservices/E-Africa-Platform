import Image from "next/image";

export default function SideImage() {
  return (
    <div className="side-img-ctn bg-[#26CD56] h-auto md:h-full md:full md:w-[35%] flex justify-center items-center rounded-2xl mt-5 md:mt-0">
      <Image
        src="/side-image.png"
        alt="Side Image"
        width={558}
        height={924}
        className="md:w-full md:max-w-[330] w-[260px] md:h-[360px] h-[260px]"
      />
    </div>
  );
}
