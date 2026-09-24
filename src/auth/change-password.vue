<script setup>
import {
    ref
} from 'vue'
import api from '@/api/axios'

const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const passwordRequirements = [
    'Minimum 8 characters long - the more, the better',
    'At least one lowercase character',
    'At least one number, symbol, or whitespace character',
    'All password fields are required',
    'New password and confirm password must match',
]

const changePassword = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
        errorMessage.value = 'All password fields are required.'
        return
    }

    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'New password and confirm password must match.'
        return
    }

    try {
        isLoading.value = true

        const requestData = {
            old_password: currentPassword.value,
            new_password: newPassword.value,
        }

        const response = await api.post('auth/change-password/', requestData)

        console.log('Change Password Response:', response.data)

        successMessage.value = response.data.detail

        currentPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
    } catch (error) {
        console.error('Change Password Error:', error)
        console.log('Status:', error.response?.status)
        console.log('Response:', error.response?.data)

        errorMessage.value = error.response?.data?.detail || 'Failed to change password. Please try again.'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
<VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
        <VCard title="Change Password">
            <VForm @submit.prevent="changePassword">
                <VCardText class="pt-0">
                    <!-- 👉 Current Password -->
                    <VRow>
                        <VCol cols="12" md="6">
                            <!-- 👉 current password -->
                            <AppTextField v-model="currentPassword" :type="isCurrentPasswordVisible ? 'text' : 'password'" :append-inner-icon="isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'" label="Current Password" autocomplete="on" placeholder="············" @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible" />
                        </VCol>
                    </VRow>

                    <!-- 👉 New Password -->
                    <VRow>
                        <VCol cols="12" md="6">
                            <!-- 👉 new password -->
                            <AppTextField v-model="newPassword" :type="isNewPasswordVisible ? 'text' : 'password'" :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'" label="New Password" autocomplete="on" placeholder="············" @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible" />
                        </VCol>

                        <VCol cols="12" md="6">
                            <!-- 👉 confirm password -->
                            <AppTextField v-model="confirmPassword" :type="isConfirmPasswordVisible ? 'text' : 'password'" :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'" label="Confirm New Password" autocomplete="on" placeholder="············" @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
                        </VCol>
                    </VRow>
                </VCardText>

                <!-- Error & success messages -->

                <p v-if="successMessage" class="text-success mb-3 ms-5">
                    {{ successMessage }}
                </p>

                <p v-if="errorMessage" class="text-error mb-3 ms-5">
                    {{ errorMessage }}
                </p>

                <!-- 👉 Password Requirements -->
                <VCardText>
                    <h6 class="text-h6 text-medium-emphasis mb-4">
                        Password Requirements:
                    </h6>

                    <VList class="card-list">
                        <VListItem v-for="item in passwordRequirements" :key="item" :title="item" class="text-medium-emphasis">
                            <template #prepend>
                                <VIcon size="10" icon="tabler-circle-filled" />
                            </template>
                        </VListItem>
                    </VList>
                </VCardText>

                <!-- 👉 Action Buttons -->
                <VCardText class="d-flex flex-wrap gap-4">
                    <VBtn type="submit" :loading="isLoading">Save changes</VBtn>

                    <VBtn type="reset" color="secondary" variant="tonal">
                        Reset
                    </VBtn>
                </VCardText>
            </VForm>
        </VCard>
    </VCol>
</VRow>
</template>

<style lang="scss" scoped>
.card-list {
    --v-card-list-gap: 16px;
}
</style>
