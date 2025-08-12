<template>
    <div class="single-swiper component-item" :class="{ 'active': activeId === item.id }">
        <div class="swiper-container" v-if="item?.images?.length" :class="[`swiper-container-${item.id}`]">
            <div class="swiper-wrapper" :options="swiperOptions">
                <div class="swiper-slide" v-for="image in item.images" :key="image.imageUrl">
                    <img class="img" :src="image.imageUrl" alt="" />
                    <a v-for="(hotspot, hotIndex) in image.hotspots" :key="hotspot.id" :href="hotspot.link" class="hot-item" :style="{ left: `${hotspot.x / 2}px`, top: `${hotspot.y / 2}px`, width: `${hotspot.width / 2}px`, height: `${hotspot.height / 2}px` }">{{ hotIndex
                        + 1 }}</a>
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
        <span v-show="!item?.images?.length">轮播图组件</span>
    </div>
</template>

<script setup>
import { watchEffect, nextTick, computed } from 'vue';

const props = defineProps({
    activeId: {
        type: String,
        default: '',
    },
    item: {
        type: Object,
        default: () => ({}),
    },
});

const swiperOptions = {
    autoHeight: true,
};

function initSwiper() {

    var mySwiper = new Swiper(`.swiper-container-${props.item.id}`, {
        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },
        observer: true,
        onSlideChangeEnd: (swiper) => {
            swiper.update();
        },

    });
}

const height = computed(() => {
    // 第一张图片的高度。动态计算
    // ，显示区域未375px，计算错误默认500px
    if (props.item?.images) {
        const img = new Image();
        img.src = props.item.images[0].imageUrl;

        img.onload = () => {
            // 获取真实高度并设置
            return img.height * 0.375 + 'px'; // 根据需要调整比例
        };

        img.onerror = () => {
            console.error('Image failed to load');
            return '500px';
        };
    }
    return '500px';
});

watchEffect(() => {
    if (props.item?.images?.length > 0) {
        nextTick(() => {
            initSwiper();
        });
    }
});


</script>

<style lang="scss" scoped>
.single-swiper {
    width: 100%;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.swiper-container {
    width: 100%;
    // height: 500px;
    position: relative;
}

.hot-item {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px dashed #000;
    cursor: pointer;
}
</style>