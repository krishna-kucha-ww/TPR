<!-- <script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Account from '@/auth/account.vue'
import ChangePassword from '@/auth/change-password.vue'

import AccountSettingsBillingAndPlans from '@/views/pages/account-settings/AccountSettingsBillingAndPlans.vue'
import AccountSettingsConnections from '@/views/pages/account-settings/AccountSettingsConnections.vue'
import AccountSettingsNotification from '@/views/pages/account-settings/AccountSettingsNotification.vue'

const route = useRoute()

const activeTab = computed(() => route.params.tab || 'account')

const tabs = [
  {
    title: 'Account',
    icon: 'tabler-users',
    tab: 'account',
  },
  {
    title: 'Security',
    icon: 'tabler-lock',
    tab: 'security',
  },
  {
    title: 'Billing & Plans',
    icon: 'tabler-file-text',
    tab: 'billing-plans',
  },
  {
    title: 'Notifications',
    icon: 'tabler-bell',
    tab: 'notification',
  },
  {
    title: 'Connections',
    icon: 'tabler-link',
    tab: 'connection',
  },
]
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.tab"
        :value="item.tab"
        :to="{
          name: 'auth-account-setting-tab',
          params: {
            tab: item.tab,
          },
        }"
      >
        <VIcon
          :icon="item.icon"
          size="20"
          start
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-6 disable-tab-transition"
      :touch="false"
    >
      <VWindowItem value="account">
        <Account />
      </VWindowItem>

      <VWindowItem value="security">
        <ChangePassword />
      </VWindowItem>

      <VWindowItem value="billing-plans">
        <AccountSettingsBillingAndPlans />
      </VWindowItem>

      <VWindowItem value="notification">
        <AccountSettingsNotification />
      </VWindowItem>

      <VWindowItem value="connection">
        <AccountSettingsConnections />
      </VWindowItem>
    </VWindow>
  </div>
</template> -->
