import { useEffect, useMemo, useState } from 'react';
import { Alert, Anchor, Button, Modal, Stack, Tabs, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MdInfo } from 'react-icons/md';

import {
	useAddYoutubeSubscriptionMutation,
	useUpdateUserYoutubeChannelMutation,
	useUserYoutubeChannelQuery,
} from '../../api/youtube';
import AlertConfirmation from '../AlertConfirmation';

const UpdateSubscriptionsModal = () => {
	const [newUserChannelId, setNewUserChannelId] = useState('');
	const [newSubscriptionChannelId, setNewSubscriptionChannelId] = useState('');
	const [tab, setTab] = useState('0');

	const [opened, handlers] = useDisclosure(false);

	const [updateUserYoutubeChannel, updateUserYoutubeChannelStatus] = useUpdateUserYoutubeChannelMutation();
	const [addYoutubeSubscription, addYoutubeSubscriptionStatus] = useAddYoutubeSubscriptionMutation();

	const userChannelStatus = useUserYoutubeChannelQuery();

	const { id: userChannelId } = useMemo(
		() => (userChannelStatus.data ? userChannelStatus.data : { id: null }),
		[userChannelStatus.data]
	);

	useEffect(() => {
		if (updateUserYoutubeChannelStatus.isSuccess) {
			setNewUserChannelId('');
		}
	}, [handlers, updateUserYoutubeChannelStatus.isSuccess]);

	useEffect(() => {
		if (addYoutubeSubscriptionStatus.isSuccess) {
			setNewSubscriptionChannelId('');
		}
	}, [addYoutubeSubscriptionStatus.isSuccess]);

	return useMemo(
		() => (
			<>
				<Button onClick={handlers.open}>Update Subscriptions</Button>
				<Modal title="Update Subscriptions" size="lg" opened={opened} onClose={handlers.close}>
					<Stack>
						<Tabs value={tab} onTabChange={(newTab) => (newTab ? setTab(newTab) : null)}>
							<Tabs.List>
								<Tabs.Tab value="0">Subscriptions</Tabs.Tab>
								<Tabs.Tab value="1">User Channel</Tabs.Tab>
							</Tabs.List>
							<Tabs.Panel value="1">
								<Stack sx={{ padding: 10 }} spacing="md">
									<Alert icon={<MdInfo />}>
										Connect and sync Youtube subscriptions by creating a{' '}
										<Anchor href="https://support.google.com/youtube/answer/1646861?hl=en">
											personal Youtube channel
										</Anchor>{' '}
										and{' '}
										<Anchor href="https://support.google.com/youtube/answer/7280190?hl=en">
											change the setting on your subscriptions to be public
										</Anchor>
									</Alert>
									<TextInput label="Current User Channel ID" value={userChannelId || ''} disabled />
									<TextInput
										label="New Channel ID"
										placeholder="Enter New Channel ID"
										onChange={(e) => setNewUserChannelId(e.target.value)}
										value={newUserChannelId}
									/>
									<Button
										onClick={() => updateUserYoutubeChannel(newUserChannelId)}
										loading={updateUserYoutubeChannelStatus.isLoading}
									>
										Submit
									</Button>
									<AlertConfirmation
										showSuccess={updateUserYoutubeChannelStatus.isSuccess}
										successMessage="Updated Channel Successfully"
										showError={updateUserYoutubeChannelStatus.isError}
										errorMessage={String(updateUserYoutubeChannelStatus.error)}
									/>
								</Stack>
							</Tabs.Panel>
							<Tabs.Panel value="0">
								<Stack sx={{ padding: 10 }} spacing="md">
									<TextInput
										label="New Subscription Channel ID"
										placeholder="Enter New Subscription Channel ID"
										onChange={(e) => setNewSubscriptionChannelId(e.target.value)}
										value={newSubscriptionChannelId}
									/>
									<Button
										onClick={() => addYoutubeSubscription(newSubscriptionChannelId)}
										loading={addYoutubeSubscriptionStatus.isLoading}
									>
										Submit
									</Button>
									<AlertConfirmation
										showSuccess={addYoutubeSubscriptionStatus.isSuccess}
										successMessage="Added Subscription Successfully"
										showError={addYoutubeSubscriptionStatus.isError}
										errorMessage={String(addYoutubeSubscriptionStatus.error)}
									/>
								</Stack>
							</Tabs.Panel>
						</Tabs>
					</Stack>
				</Modal>
			</>
		),
		[
			addYoutubeSubscription,
			addYoutubeSubscriptionStatus.error,
			addYoutubeSubscriptionStatus.isError,
			addYoutubeSubscriptionStatus.isLoading,
			addYoutubeSubscriptionStatus.isSuccess,
			handlers.close,
			handlers.open,
			newSubscriptionChannelId,
			newUserChannelId,
			opened,
			tab,
			updateUserYoutubeChannel,
			updateUserYoutubeChannelStatus.error,
			updateUserYoutubeChannelStatus.isError,
			updateUserYoutubeChannelStatus.isLoading,
			updateUserYoutubeChannelStatus.isSuccess,
			userChannelId,
		]
	);
};

export default UpdateSubscriptionsModal;
