<script setup>
import api from '@/api/axios'

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})

const standardPlan = {
  plan: 'Standard',
  price: 99,
  benefits: [
    '10 Users',
    'Up to 10GB storage',
    'Basic Support',
  ],
}

const isUserInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)

const refInputEl = ref() 
const imageError = ref('') 
const isLoading = ref(false)

const resolveUserRoleVariant = role => {
  if (role === 'subscriber')
    return {
      color: 'warning',
      icon: 'tabler-user',
    }
  if (role === 'author')
    return {
      color: 'success',
      icon: 'tabler-circle-check',
    }
  if (role === 'maintainer')
    return {
      color: 'primary',
      icon: 'tabler-chart-pie-2',
    }
  if (role === 'editor')
    return {
      color: 'info',
      icon: 'tabler-pencil',
    }
  if (role === 'admin')
    return {
      color: 'secondary',
      icon: 'tabler-server-2',
    }
  
  return {
    color: 'primary',
    icon: 'tabler-user',
  }
}

// Upload avatar image
const changeAvatar = async event => {
    const file = event.target.files?.[0]

    imageError.value = ''

    if (!file)
        return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    const maxSize = 2 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
        imageError.value = 'Allowed JPG, GIF or PNG.'
        event.target.value = ''
        return
    }

    if (file.size > maxSize) {
        imageError.value = 'Max size is 2MB.'
        event.target.value = ''
        return
    }

    try {
        isLoading.value = true

        const formData = new FormData()

        formData.append('image', file)

        const response = await api.post(
            `users/${props.userData.id}/profile-image/`,
            formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        console.log('Profile Image Upload Response:', props.userData.profile_image,)

        props.userData.profile_image = response.data.profile_image


        console.log('Profile Image Upload Response:', props.userData.profile_image,)
        // Get updated profile data
        // await fetchProfile()
        props.userData.profile_image = response.data.profile_image

    } catch (error) {
        // console.error('Profile Image Upload Error:', error)
        // console.log('Status:', error.response?.status)
        // console.log('Response:', error.response?.data)
    } finally {
        isLoading.value = false
        event.target.value = ''
    }
}

// delete avatar image
const deleteAvatar = async () => {
    try {
        isLoading.value = true

        const response = await api.delete(`users/${props.userData.id}/profile-image/`)

        console.log('Profile Image Delete Response:', response.data)

        await fetchProfile() 

    }catch (error) {
        console.error('Profile Image Delete Error:', error)
        console.log('Status:', error.response?.status)
        console.log('Response:', error.response?.data)
    }
    finally {
        isLoading.value =false
    }
}
</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.userData">
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->
           
          <VAvatar
            rounded
            :size="100"
            :color="!props.userData.profile_image ? 'primary' : undefined"
            :variant="!props.userData.profile_image ? 'tonal' : undefined"
          >
          
            <VImg
              v-if="props.userData.profile_image"
              :src="props.userData.profile_image"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.userData.name) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h5 class="text-h5 mt-4">
            {{ props.userData.name }}
          </h5>

          <!-- 👉 Role chip -->
          <VChip
            label
            :color="resolveUserRoleVariant(props.userData.role).color"
            size="small"
            class="text-capitalize mt-4"
          >
            {{ props.userData.roles?.[0] || '-' }}
          </VChip>
        </VCardText>

        <!-- 👉 Upload Photo -->
                <form class="d-flex flex-column justify-center gap-4 align-center">
                    <div class="d-flex flex-wrap gap-4">
                        <VBtn color="primary" size="small" @click="refInputEl?.click()">
                            <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                            <span class="d-none d-sm-block">Upload photo</span>
                        </VBtn>

                        <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden @change="changeAvatar">

                        <VBtn type="button" size="small" color="error" variant="tonal" @click="deleteAvatar">
                            <VIcon icon="tabler-trash" class="d-sm-none" />
                            Delete
                        </VBtn>
                    </div>

                    <!-- <p class="text-body-1 mb-0">
                        Allowed JPG, GIF or PNG. Max size of 2MB
                    </p> -->
                    <p v-if="imageError" class="text-error mb-0">
                       {{ imageError }}
                    </p>
                </form>

        <VCardText>
          <div class="d-flex justify-space-around gap-x-6 gap-y-2 flex-wrap mb-6">
            <!-- 👉 Done task -->
            <div class="d-flex align-center me-8">
              <VAvatar
                :size="40"
                rounded
                color="primary"
                variant="tonal"
                class="me-4"
              >
                <VIcon
                  icon="tabler-checkbox"
                  size="24"
                />
              </VAvatar>
              <div>
                <h5 class="text-h5">
                  {{ `${(props.userData.taskDone / 1000).toFixed(2)}k` }}
                </h5>

                <span class="text-sm">Task Done</span>
              </div>
            </div>

            <!-- 👉 Done Project -->
            <div class="d-flex align-center me-4">
              <VAvatar
                :size="38"
                rounded
                color="primary"
                variant="tonal"
                class="me-4"
              >
                <VIcon
                  icon="tabler-briefcase"
                  size="24"
                />
              </VAvatar>
              <div>
                <h5 class="text-h5">
                  {{ kFormatter(props.userData.projectDone) }}
                </h5>
                <span class="text-sm">Project Done</span>
              </div>
            </div>
          </div>

          <!-- 👉 Details -->
          <h5 class="text-h5">
            Details
          </h5>

          <VDivider class="my-4" />

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Username:
                  <div class="d-inline-block text-body-1">
                    {{ props.userData.name || '-' }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <span class="text-h6">
                  Billing Email:
                </span>
                <span class="text-body-1">
                  {{ props.userData.email || '-'}}
                </span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Status:
                  <div class="d-inline-block text-body-1 text-capitalize">
                    {{ props.userData.is_active ? 'Active' : 'Inactive' }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Role:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ props.userData.roles?.join(', ') || '-' }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center gap-x-4">
          <VBtn
            variant="elevated"
            @click="isUserInfoEditDialogVisible = true"
          >
            Edit
          </VBtn>

          <VBtn
            variant="tonal"
            color="error"
          >
            Suspend
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION Current Plan -->
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex">
          <!-- 👉 Standard Chip -->
          <VChip
            label
            color="primary"
            size="small"
            class="font-weight-medium"
          >
            Popular
          </VChip>

          <VSpacer />

          <!-- 👉 Current Price  -->
          <div class="d-flex align-center">
            <sup class="text-h5 text-primary mt-1">$</sup>
            <h1 class="text-h1 text-primary">
              99
            </h1>
            <sub class="mt-3"><h6 class="text-h6 font-weight-regular mb-n1">/ month</h6></sub>
          </div>
        </VCardText>

        <VCardText>
          <!-- 👉 Price Benefits -->
          <VList class="card-list">
            <VListItem
              v-for="benefit in standardPlan.benefits"
              :key="benefit"
            >
              <div class="d-flex align-center gap-x-2">
                <VIcon
                  size="10"
                  color="secondary"
                  icon="tabler-circle-filled"
                />
                <div class="text-medium-emphasis">
                  {{ benefit }}
                </div>
              </div>
            </VListItem>
          </VList>

          <!-- 👉 Days -->
          <div class="my-6">
            <div class="d-flex justify-space-between mb-1">
              <h6 class="text-h6">
                Days
              </h6>
              <h6 class="text-h6">
                26 of 30 Days
              </h6>
            </div>

            <!-- 👉 Progress -->
            <VProgressLinear
              rounded
              rounded-bar
              :model-value="65"
              color="primary"
            />

            <p class="mt-1">
              4 days remaining
            </p>
          </div>

          <!-- 👉 Upgrade Plan -->
          <div class="d-flex gap-4">
            <VBtn
              block
              @click="isUpgradePlanDialogVisible = true"
            >
              Upgrade Plan
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit user info dialog -->
  <UserInfoEditDialog
    v-model:is-dialog-visible="isUserInfoEditDialogVisible"
    :user-data="props.userData"
  />

  <!-- 👉 Upgrade plan dialog -->
  <UserUpgradePlanDialog v-model:is-dialog-visible="isUpgradePlanDialogVisible" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
