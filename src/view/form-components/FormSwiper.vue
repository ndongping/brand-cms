<template>
    <div class="form-item">
        <draggable class="list2-group" :list="item?.images" :animation="340" group="selectItem" handle=".option-drag" item-key="uuid">
            <template #item="{ element, index }">
                <div class="swiper-image-item selectItem">
                    <h5 class="swiper-image-item-title option-drag">图片{{ index + 1 }}
                        <DragOutlined />
                    </h5>
                    <a-input class="mt-10" v-model:value="item.images[index].imageUrl" placeholder="请输入图片地址" />
                    <img v-if="item.images[index].imageUrl" :style="{ width: '60px', height: 'auto' }" :src="item.images[index].imageUrl" alt="" class="img" />
                    <h5 class="mt-10">跳转链接</h5>
                    <a-input class="mt-10" v-model:value="item.images[index].link" placeholder="请输入跳转链接" />

                    <a-button class="mt-30" @click="handleHotspot(element)">图片热区</a-button>
                    <div class="mt-20" v-for="(hotspot, hotIndex) in item.images[index].hotspots" :key="hotspot.id">
                        <h5>热区{{ hotIndex + 1 }}</h5>
                        <a-input v-model:value="hotspot.link" placeholder="请输入跳转链接" />
                    </div>
                    <a-button class="mt-20" type="primary" danger ghost @click="removeImage(element.uuid)">删除</a-button>
                </div>
            </template>
        </draggable>
        <div class="mt-20">
            <a-button type="primary" @click="addImage">添加图片</a-button>
        </div>
        <ImageHotspot v-model:open="open" :item="currentItem" :imageUrl="currentItem?.imageUrl" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getUniqueId } from '@/utils/tools';
import draggable from 'vuedraggable';
import { DragOutlined } from '@ant-design/icons-vue';
import ImageHotspot from './ImageHotspot.vue';

const props = defineProps({
    item: Object,
});

const currentItem = ref(null);
const open = ref(false);

const handleHotspot = (element) => {
    currentItem.value = element;
    open.value = true;
};

const addImage = () => {
    if (!Array.isArray(props.item?.images)) {
        props.item.images = [];
    }
    props.item?.images?.push({
        imageUrl: '',
        uuid: getUniqueId(),
    });
};

// 删除图片的方法
const removeImage = (uuid) => {
    if (Array.isArray(props.item?.images)) {
        props.item.images = props.item.images.filter(item => item.uuid !== uuid); // 从数组中移除指定 UUID 的图片
    }
};
</script>

<style lang="scss" scoped>
.form-item {
    .swiper-image-item {
        margin-bottom: 20px;
        border: 1px solid #ddd;
        padding: 10px;

        .swiper-image-item-title {
            width: 100px;
            cursor: move;
        }
    }
}
</style>