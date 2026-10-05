<script setup>
import api from '@/api/axios'

const props = defineProps({
    userData: {
        type: Object,
        required: false,
        default: () => ({
            id: null,
            name: '',
            roles: [],
            email: '',
            is_active: true,
        }),
    },
    isDialogVisible: {
        type: Boolean,
        required: true,
    },
})

const roles = [
  { title: 'Admin', value: 'admin' },
  { title: 'Editor', value: 'editor' },
  { title: 'Viewer', value: 'viewer' },
]

const status = [
  { title: 'Pending', value: 'pending' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
]

const emit = defineEmits([
    'submit',
    'update:isDialogVisible',
])

const isLoading = ref(false)
const errorMessage = ref('')

const userData = ref(structuredClone(toRaw(props.userData)))

watch(() => props.userData, () => {
    userData.value = structuredClone(toRaw(props.userData))
})

const onFormSubmit = async() => {
    try {
        isLoading.value = true
        errorMessage.value = ''

       const requestData = {
            email: userData.value.email,
            name: userData.value.name,
            is_active: userData.value.is_active === 'active',
            is_staff: userData.value.is_staff,
            is_superuser: userData.value.is_superuser,
       }

       const response = await api.patch(`/users/${userData.value.id}/`, requestData)

       console.log('User updated successfully:', response.data)

    //    Role assign
      const roleRequestData = {
        role_codes: userData.value.roles
      }

      const roleResponse = await api.post(`/users/${userData.value.id}/assign-roles/`, roleRequestData)
      console.log('Roles assigned successfully:', roleResponse.data)

      emit('submit', {
      ...response.data,
      roles: userData.value.roles,
    })
      emit('update:isDialogVisible', false)

    } catch (error) {
      console.error('Error updating user information:', error)

      console.log('Status:', error.response?.status)
      console.log('Response:', error.response?.data)

      errorMessage.value = error.response?.data?.detail || 'Failed to update user information. Please try again.'
    } finally {
      isLoading.value = false
    }
}

const onFormReset = () => {
    userData.value = structuredClone(toRaw(props.userData))
    emit('update:isDialogVisible', false)
}

const dialogModelValueUpdate = val => {
    emit('update:isDialogVisible', val)
}
</script>

<template>
<VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible" @update:model-value="dialogModelValueUpdate">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-10 pa-2">
        <VCardText>
            <!-- 👉 Title -->
            <h4 class="text-h4 text-center mb-2">
                Edit User Information
            </h4>
            <p class="text-body-1 text-center mb-6">
                Updating user details will receive a privacy audit.
            </p>

            <!-- 👉 Form -->
            <VForm class="mt-6" @submit.prevent="onFormSubmit">
                <VRow>
                    <!-- 👉 First Name -->
                    <VCol cols="12" md="6">
                        <AppTextField v-model="userData.name.split(' ')[0]" label="First Name" placeholder="John" />
                    </VCol>

                    <!-- 👉 Last Name -->
                    <VCol cols="12" md="6">
                        <AppTextField v-model="userData.name.split(' ')[1]" label="Last Name" placeholder="Doe" />
                    </VCol>

                    <!-- 👉 Billing Email -->
                    <VCol cols="12" md="6">
                        <AppTextField v-model="userData.email" label="Email" placeholder="johndoe@email.com" />
                    </VCol>

                    <!-- Role --> 
                     <VCol cols="12" md="6" > 
                         <AppSelect v-model="userData.roles" label="Role" placeholder="Select role" :items="roles" multiple chips closable-chips /> 
                    </VCol>

                    <!-- 👉 Status -->
                    <VCol cols="12" md="6">
                        <AppSelect v-model="userData.is_active" label="Status" placeholder="Active" :items="status" />
                    </VCol>

                    <!-- 👉 Submit and Cancel -->
                    <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
                        <VBtn type="submit" :isloading="isLoading" :disabled="isLoading">
                            Submit
                        </VBtn>

                        <VBtn color="secondary" variant="tonal" @click="onFormReset">
                            Cancel
                        </VBtn>
                    </VCol>
                </VRow>
            </VForm>
        </VCardText>
    </VCard>
</VDialog>
</template>
