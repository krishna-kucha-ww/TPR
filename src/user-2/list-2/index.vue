<script setup>
import api from '@/api/axios'
import { avatarText } from '@core/utils/formatters'
import { onMounted, ref, watch } from 'vue'

const searchQuery = ref('')
const selectedRole = ref()
const selectedStatus = ref()

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const selectedRows = ref([])

const users = ref([])
const totalUsers = ref(0)

const isLoading = ref(false)
const errorMessage = ref('')

// Headers
const headers = [
  {
    title: 'User',
    key: 'user',
    sortable: false,
  },
  {
    title: 'Role',
    key: 'role',
    sortable: false,
  },
  {
    title: 'Date Joined',
    key: 'date_joined',
    sortable: false,
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

const fetchUsers = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('users/', {
      params: {
        page: page.value,
        page_size: itemsPerPage.value,
        search: searchQuery.value,
      },
    })

    // console.log('Users API Response:', response.data)

    users.value = response.data.data || []
    totalUsers.value = response.data.count || 0
  }
  catch (error) {
    console.error('Users API Error:', error)

    errorMessage.value =
      error.response?.data?.detail ||
      'Failed to load users.'
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

watch(searchQuery, () => {
  page.value = 1
  fetchUsers()
})

// const users = computed(() => usersData.value.users)
// const totalUsers = computed(() => usersData.value.totalUsers)

// 👉 search filters
const roles = [
  {
    title: 'Admin',
    value: 'admin',
  },
  {
    title: 'Author',
    value: 'author',
  },
  {
    title: 'Editor',
    value: 'editor',
  },
  {
    title: 'Maintainer',
    value: 'maintainer',
  },
  {
    title: 'Subscriber',
    value: 'subscriber',
  },
]

const status = [
  {
    title: 'Pending',
    value: 'pending',
  },
  {
    title: 'Active',
    value: 'active',
  },
  {
    title: 'Inactive',
    value: 'inactive',
  },
]

const resolveUserRoleVariant = role => {
  const roleLowerCase = String(role || '').toLowerCase()

  if (roleLowerCase === 'admin') {
    return {
      color: 'primary',
      icon: 'tabler-crown',
    }
  }

  if (roleLowerCase === 'editor') {
    return {
      color: 'warning',
      icon: 'tabler-edit',
    }
  }

  if (roleLowerCase === 'viewer') {
    return {
      color: 'info',
      icon: 'tabler-eye',
    }
  }

  return {
    color: 'secondary',
    icon: 'tabler-user',
  }
}

// const formatDate = date => {
//   if (!date)
//     return '-'

//   return new Date(date).toLocaleDateString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   })
// }

const resolveUserStatusVariant = stat => {
  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'pending')
    return 'warning'
  if (statLowerCase === 'active')
    return 'success'
  if (statLowerCase === 'inactive')
    return 'secondary'
  
  return 'primary'
}

const isAddNewUserDrawerVisible = ref(false)

const addNewUser = async userData => {
  await $api('/apps/users', {
    method: 'POST',
    body: userData,
  })

  // Refetch User
  fetchUsers()
}

const deleteUser = async id => {
  try {
    await api.delete(`users/${id}`)
  
  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch User
  fetchUsers()

   } 
    catch (error) {
      console.error('Delete User Error:', error)
      errorMessage.value = error.response?.data?.detail ||'Failed to delete user.' 
    }
}
</script>

<template>
  <section>
    <VCard class="mb-6">
      <VCardItem class="pb-4">
        <VCardTitle>Filters</VCardTitle>
      </VCardItem>

      <VCardText>
        <VRow>
          <!-- 👉 Select Role -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedRole"
              placeholder="Select Role"
              :items="roles"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
      
          <!-- 👉 Select Status -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedStatus"
              placeholder="Select Status"
              :items="status"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="inline-size: 6.25rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />
        </div>
        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 15.625rem;">
            <AppTextField
              v-model="searchQuery"
              placeholder="Search User"
            />
          </div>

          <!-- 👉 Export button -->
          <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
          >
            Export
          </VBtn>

          <!-- 👉 Add user button -->
          <VBtn
            prepend-icon="tabler-plus"
            @click="isAddNewUserDrawerVisible = true"
          >
            Add New User
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :items="users"
        item-value="id"
        :items-length="totalUsers"
        :headers="headers"
        class="text-no-wrap"
        show-select
      >
        <!-- User -->
        <template #item.user="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar
              size="34"
              :variant="!item.profile_image ? 'tonal' : undefined"
              :color="!item.profile_image ? resolveUserRoleVariant(item.roles?.[0]).color : undefined"
            >
              <VImg
                v-if="item.profile_image"
                :src="item.profile_image"
                :alt="item.name"
              />
              <span v-else>{{ avatarText(item.name) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-base">
                <RouterLink
                  :to="{ name: 'user-2-view', params: { id: item.id } }"
                  class="font-weight-medium text-link"
                >
                  {{ item.name }}
                </RouterLink>
              </h6>
              <div class="text-sm">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template>

        <!-- 👉 Role -->
        <template #item.role="{ item }">
          <div class="d-flex align-center gap-x-2">
            <VIcon
              :size="22"
              :icon="resolveUserRoleVariant(item.roles?.[0]).icon"
              :color="resolveUserRoleVariant(item.roles?.[0]).color"
            />

            <div class="text-capitalize text-high-emphasis text-body-1">
              {{ item.roles?.join(', ') || '-' }}
            </div>
          </div>
        </template>

        <!-- Date Joined -->
        <template #item.date_joined="{ item }">
          <span>
            {{ item.date_joined }}
          </span>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip
            :color="item.is_active ? 'success' : 'secondary'"
            size="small"
            label
            class="text-capitalize"
          >
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="deleteUser(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>

          <IconBtn>
            <VIcon icon="tabler-eye" />
          </IconBtn>

          <VBtn
            icon
            variant="text"
            color="medium-emphasis"
          >
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem :to="{ name: 'user-2-view', params: { id: item.id } }">
                  <template #prepend>
                    <VIcon icon="tabler-eye" />
                  </template>

                  <VListItemTitle>View</VListItemTitle>
                </VListItem>

                <VListItem link>
                  <template #prepend>
                    <VIcon icon="tabler-pencil" />
                  </template>
                  <VListItemTitle>Edit</VListItemTitle>
                </VListItem>

                <VListItem @click="deleteUser(item.id)">
                  <template #prepend>
                    <VIcon icon="tabler-trash" />
                  </template>
                  <VListItemTitle>Delete</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalUsers"
          />
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>
    <!-- 👉 Add New User -->
    <AddNewUserDrawer
      v-model:is-drawer-open="isAddNewUserDrawerVisible"
      @user-data="addNewUser"
    />
  </section>
</template>
