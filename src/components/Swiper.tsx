import React, {FC} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {Navigation, Pagination} from "swiper";
import {Image as ImageType} from "@/types";
import {Image} from "antd"

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type SwiperComponentType = {
    images: ImageType[]
}

const SwiperComponent: FC<SwiperComponentType> = ({images}) => {
    return (
        <Swiper
            slidesPerView={3}
            spaceBetween={30}
            loop={true}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
        >
            {
                images.map(image =>
                    <SwiperSlide key={image.id}>
                        <Image
                            width={200}
                            src={process.env.NEXT_PUBLIC_API_HOST + '/image/' + image.path}
                        />
                    </SwiperSlide>
                )
            }
        </Swiper>
    )
}

export default SwiperComponent