<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import api from '@/api/axios'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
])

const isFormValid = ref(false)
const refForm = ref()
const name = ref('')
const email = ref('')
const role = ref()
const status = ref()

const isLoading = ref(false)
const errorMessage = ref('')

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (!valid) 
      return

      try {
        const requestData = {
            name: name.value,
            email: email.value,
            password: "password.value",
            role_codes: [role.value],
            is_active: status.value === 'active',
        }

        const response = await api.post('users/', requestData)

        console.log('User created successfully:', response.data)

        emit('update:isDrawerOpen', false)
        emit('userData', response.data)

        nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    } catch (error) {
        console.error('Error creating user:', error)

        console.log('Status:', error.response?.status)
        console.log('Response:', error.response?.data)

        errorMessage.value = error.response?.data?.detail || 'Failed to create user. Please try again.'
    } finally {
        isLoading.value = false
        }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VDialog
    :model-value="props.isDrawerOpen"
    max-width="725"
    persistent
    @update:model-value="emit('update:isDrawerOpen', $event)"
  >

  <VCard class="user-dialog-card" >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      title="Add New User"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <AppTextField
                  v-model="name"
                  :rules="[requiredValidator]"
                  label="Full Name"
                  placeholder="John Doe"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  placeholder="johndoe@email.com"
                />
              </VCol>
              
              <!-- 👉 Role -->
              <VCol cols="12">
                <AppSelect
                  v-model="role"
                  label="Select Role"
                  placeholder="Select Role"
                  :rules="[requiredValidator]"
                  :items="[{ title: 'Admin', value: 'admin' },{ title: 'Viewer', value: 'viewer' },{ title: 'Editor', value: 'editor' }]"
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect
                  v-model="status"
                  label="Select Status"
                  placeholder="Select Status"
                  :rules="[requiredValidator]"
                  :items="[{ title: 'Active', value: 'active' }, { title: 'Inactive', value: 'inactive' }, { title: 'Pending', value: 'pending' }]"
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3" :loading="isLoading" :disabled="isLoading"
                >
                  Submit
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="error"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
    </PerfectScrollbar>
    </VCard>
  </VDialog>
</template>

 