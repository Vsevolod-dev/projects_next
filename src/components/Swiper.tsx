import React, {FC, useState} from "react";
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
    const [currentImage, setCurrentImage] = useState(-1);

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
                images.map((image, id) =>
                    <SwiperSlide key={image.id}>
                        <Image
                            preview={{
                                visible: false
                            }}
                            src={process.env.NEXT_PUBLIC_API_HOST + '/image/' + image.path}
                            alt={'image'}
                            onClick={() => setCurrentImage(id)}
                        />
                        {image.desc && <p>{image.desc}</p>}
                    </SwiperSlide>
                )
            }
            <div style={{ display: 'none' }}>
                <Image.PreviewGroup preview={{ 
                    visible: currentImage !== -1 ? true : false,
                    onVisibleChange: (vis) => {
                        if (!vis) setCurrentImage(-1)
                    },
                    current: currentImage,
                    countRender: (current) => images[current - 1]?.desc
                }}>
                    {images.map(image => 
                        <div key={image.id} >
                            <Image 
                                height={800}
                                src={process.env.NEXT_PUBLIC_API_HOST + '/image/' + image.path} 
                                alt={'image'}
                            />
                        </div>
                    )}
                </Image.PreviewGroup>
            </div>
        </Swiper>
    )
}

export default SwiperComponent