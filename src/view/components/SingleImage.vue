<template>
    <div class="single-image component-item" :class="{ 'active': activeId === item.id }">
        <img :src="item.imageUrl" v-if="item.imageUrl" alt="image" class="img" />
        <span v-else>单图组件</span>

        <a v-for="(hotspot, hotIndex) in item.hotspots" :key="hotspot.id" :href="hotspot.link" class="hot-item" :style="{ left: `${hotspot.x / 2}px`, top: `${hotspot.y / 2}px`, width: `${hotspot.width / 2}px`, height: `${hotspot.height / 2}px` }">{{ hotIndex
            + 1 }}</a>
    </div>
</template>

<script setup>
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

</script>

<style lang="scss" scoped>
.single-image {
    width: 100%;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .hot-item {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px dashed #000;
        cursor: pointer;
    }
}
</style>