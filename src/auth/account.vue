<script setup>
import api from '@/api/axios'
import avatar1 from '@images/avatars/avatar-1.png'

import {
    onMounted,
    ref
} from 'vue'

// profile data from api
const profileData = ref({
    id: null,
    name: '',
    email: '',
    profile_image: null,
    roles: [],
})

const roleOptions = ref([])

const refInputEl = ref()
const isLoading = ref(false)
const imageError = ref('')

const isAccountDeactivated = ref(false)

const isConfirmDialogOpen = ref(false)

const validateAccountDeactivation = [v => !!v || 'Please confirm account deactivation']

// logged - in user data
const fetchProfile = async () => {
    isLoading.value = true
    try {
        const response = await api.get('auth/me/')
        console.log('Auth Me Response:', response.data)
        profileData.value = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            profile_image: response.data.profile_image,
            roles: response.data.roles || [],
        }
        console.log('Profile Data:', profileData.value)

    } catch (error) {
        console.error('Auth Me API Error:', error)
    }
}

onMounted(() => {
    fetchProfile()
    fetchRoles()
})

const resetForm = () => {
    fetchProfile()
}

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
            'auth/profile-image/',
            formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        console.log('Profile Image Upload Response:', response.data)

        // Get updated profile data
        await fetchProfile()
    } catch (error) {
        console.error('Profile Image Upload Error:', error)
        console.log('Status:', error.response?.status)
        console.log('Response:', error.response?.data)
    } finally {
        isLoading.value = false
        event.target.value = ''
    }
};

// delete avatar image
const deleteAvatar = async () => {
    try {
        isLoading.value = true

        const response = await api.delete('auth/profile-image/')

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

const fetchRoles = async () => {
    try {
        const response = await api.get('roles/')

        console.log('Role Options:', roleOptions.value)

        roleOptions.value = response.data.data.map(role => role.code)
    }
    catch (error) {
        console.error('Roles API Error:', error)
    }
}

// update profile 
const updateProfile = async () => {
    try {
        isLoading.value = true

        const requestData = {
            name: profileData.value.name,
            email: profileData.value.email,
            role_codes: profileData.value.roles
        }

        const response = await api.put('auth/profile/', requestData)

        console.log("Profile Update Response:", response.data)

        await fetchProfile()
    }
    catch (error) {
        console.error("Profile Update Error:", error)
        console.log('Status:', error.response?.status)
        console.log('Response:', error.response?.data)
    }
    finally {
        isLoading.value = false
    }
}

</script>

<template>
<VRow>
    <VCol cols="12">
        <VCard>
            <VCardText class="d-flex">
                <!-- 👉 Avatar -->
                <VAvatar rounded size="100" class="me-6" :image="profileData?.profile_image || avatar1" />

                <!-- 👉 Upload Photo -->
                <form class="d-flex flex-column justify-center gap-4">
                    <div class="d-flex flex-wrap gap-4">
                        <VBtn color="primary" size="small" @click="refInputEl?.click()">
                            <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                            <span class="d-none d-sm-block">Upload new photo</span>
                        </VBtn>

                        <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden @change="changeAvatar">

                        <VBtn type="button" size="small" color="error" variant="tonal" @click="deleteAvatar">
                            <VIcon icon="tabler-trash" class="d-sm-none" />
                            Delete
                        </VBtn>
                    </div>

                    <p class="text-body-1 mb-0">
                        Allowed JPG, GIF or PNG. Max size of 2MB
                    </p>
                    <p v-if="imageError" class="text-error mb-0">
                       {{ imageError }}
                    </p>
                </form>
            </VCardText>

            <VCardText class="pt-2">
                <!-- 👉 Form -->
                <VForm class="mt-3">
                    <VRow>
                        <!-- 👉 First Name -->
                        <VCol md="6" cols="12">
                            <AppTextField v-model="profileData.name" placeholder="Enter name" label="Name" />
                        </VCol>

                        <!-- 👉 Email -->
                        <VCol cols="12" md="6">
                            <AppTextField v-model="profileData.email" label="E-mail" placeholder="Enter email" type="email" />
                        </VCol>

                        <!-- 👉 Role-->
                        <VCol cols="12" md="6">
                            <AppSelect v-model="profileData.roles" :items="roleOptions" :menu-props="{ maxHeight: '400' }" label="Role" chips multiple closable-chips placeholder="Select Role" />
                        </VCol>

                        <!-- 👉 Form Actions -->
                        <VCol cols="12" class="d-flex flex-wrap gap-4">
                            <VBtn @click="updateProfile">Save changes</VBtn>

                            <VBtn color="secondary" variant="tonal" type="reset" @click.prevent="resetForm">
                                Cancel
                            </VBtn>
                        </VCol>
                    </VRow>
                </VForm>
            </VCardText>
        </VCard>
    </VCol>

    <VCol cols="12">
        <!-- 👉 Delete Account -->
        <VCard title="Delete Account">
            <VCardText>
                <!-- 👉 Checkbox and Button  -->
                <div>
                    <VCheckbox v-model="isAccountDeactivated" :rules="validateAccountDeactivation" label="I confirm my account deactivation" />
                </div>

                <VBtn :disabled="!isAccountDeactivated" color="error" class="mt-6" @click="isConfirmDialogOpen = true">
                    Deactivate Account
                </VBtn>
            </VCardText>
        </VCard>
    </VCol>
</VRow>

<!-- Confirm Dialog -->
<ConfirmDialog v-model:is-dialog-visible="isConfirmDialogOpen" confirmation-question="Are you sure you want to deactivate your account?" confirm-title="Deactivated!" confirm-msg="Your account has been deactivated successfully." cancel-title="Cancelled" cancel-msg="Account Deactivation Cancelled!" />
</template>
