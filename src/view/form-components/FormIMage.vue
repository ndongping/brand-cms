<template>
    <div class="form-item">
        <h5>图片地址</h5>
        <a-input v-model:value="item.imageUrl" placeholder="请输入图片url" />
        <img v-if="item.imageUrl" :style="{ width: '60px', height: 'auto' }" :src="item.imageUrl" alt="" class="img" />
        <h5 class="mt-10">跳转链接</h5>
        <a-input v-model:value="item.link" placeholder="请输入跳转链接" />
    </div>
    <ImageHotspot v-model:open="open" :item="item" :imageUrl="item.imageUrl" />
    <a-button class="mt-10" @click="open = true">图片热区</a-button>
    <div class="mt-20" v-for="(hotspot, hotIndex) in item.hotspots" :key="hotspot.id">
        <h5>热区{{ hotIndex + 1 }}</h5>
        <a-input v-model:value="hotspot.link" placeholder="请输入跳转链接" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

import ImageHotspot from './ImageHotspot.vue';

const props = defineProps({
    item: {
        type: Object,
        default: () => ({}),
    },
});

const open = ref(false);


</script>

<style lang="scss" scoped></style>