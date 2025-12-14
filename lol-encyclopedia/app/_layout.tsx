import React from 'react';
import { Stack } from 'expo-router';
import { LikedChampionsProvider } from '../store/LikedChampions';

export default function RootLayout() {
    return (
        <LikedChampionsProvider>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#111827' },
                    headerTintColor: '#f9fafb',
                    headerTitleStyle: { fontWeight: 'bold' },
                    contentStyle: { backgroundColor: '#020617' },
                }}
            >
                <Stack.Screen name="index" options={{ title: 'LoL Encyclopedia' }} />
                <Stack.Screen name="champions/index" options={{ title: 'Champions' }} />
                <Stack.Screen name="champions/[id]" options={{ title: 'Champion Detail' }} />
                <Stack.Screen name="liked/index" options={{ title: 'Liked Champions' }} />
            </Stack>
        </LikedChampionsProvider>
    );
}
