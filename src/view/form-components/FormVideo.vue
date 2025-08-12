<template>
    <div class="form-item">
        <a-input v-model:value="item.videoId" placeholder="请输入视频id" />
    </div>
</template>

<script setup>

const props = defineProps({
    item: {
        type: Object,
        default: () => ({}),
    },
});


</script>

<style lang="scss" scoped>
.form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>