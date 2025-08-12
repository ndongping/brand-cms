<template>
    <div class="index">
        <div class="left">
            <draggable class="dragArea list-group" :clone="customClone" :sort="false" :list="list1" :group="{ name: 'people', pull: 'clone', put: false }" item-key="id">
                <template #item="{ element }">
                    <div class="list-group-item left-item">
                        {{ element.name }}
                    </div>
                </template>
            </draggable>
        </div>
        <div class="center">
            <div class="center-header">
                <a-button type="primary" @click="handleView">预览</a-button>
            </div>
            <div class="center-list-container">
                <draggable class="dragArea list-group center-list" :animation="340" :list="list2" group="people" item-key="id">
                    <template #item="{ element, index }">
                        <div class="list-group-item">
                            <div class="delete">
                                <DeleteOutlined class="close-icon" @click="handleClose(element)" />
                            </div>
                            <component :is="components[element.type]" :index="index" :key="element.id" :activeId="activeId" :item="element" @click="handleClick(element)" />
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
        <div class="right">
            <template v-if="currentItem">
                <h3 class="mb-10">{{ currentItem?.name }}组件配置</h3>
                <div class="mb-10">
                    {{ currentItem?.id }}
                </div>
                <component :is="formComponents[currentItem?.type]" :key="currentItem?.id" :item="currentItem" />
            </template>
        </div>
        <PreviewModal v-model:open="previewOpen" :items="list2" />
    </div>
</template>

<script setup>

import './index.scss';
import { ref, computed } from 'vue';
import draggable from 'vuedraggable';
import { getUniqueId } from '@/utils/tools';
import SingleImage from './components/SingleImage.vue';
import SingleSwiper from './components/SingleSwiper.vue';
import SingleVideo from './components/SingleVideo.vue';
import FormImage from './form-components/FormIMage.vue';
import FormVideo from './form-components/FormVideo.vue';
import FormSwiper from './form-components/FormSwiper.vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import PreviewModal from './PreviewModal.vue';

const components = {
    image: SingleImage,
    swiper: SingleSwiper,
    video: SingleVideo,
};

const formComponents = {
    image: FormImage,
    video: FormVideo,
    swiper: FormSwiper,
};

const activeId = ref('');
const previewOpen = ref(false);

const list1 = ref([
    { name: "单图组件", id: getUniqueId(), type: 'image' },
    { name: "轮播组件", id: getUniqueId(), type: 'swiper' },
    { name: "视频组件", id: getUniqueId(), type: 'video' },
]);

const list2 = ref([]);
const currentItem = ref(list2.value[0]);

const customClone = (item) => {
    const clonedItem = { ...item, id: getUniqueId() }; // 生成唯一 ID
    return clonedItem;
};

const handleView = () => {
    previewOpen.value = true;
    console.log('list2', list2.value);
};

const handleClick = (element) => {
    activeId.value = element.id;
    currentItem.value = element;
};

const handleClose = (element) => {
    list2.value = list2.value.filter((item) => item.id !== element.id);
};
</script>