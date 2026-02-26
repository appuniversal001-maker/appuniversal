import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { supabase } from '../lib/supabase';

// In a real app, this would be registered via TaskManager for background execution
// Ensure background permissions are requested in App.tsx

let locationSubscription: Location.LocationSubscription | null = null;
let recording: Audio.Recording | null = null;

export const startStealthMode = async () => {
    console.log('Initiating Stealth SOS...');

    try {
        // 1. Create Incident in Supabase
        const { data: incident, error } = await supabase
            .from('incidents')
            .insert({
                victim: 'Operador Oculto', // Should come from user profile
                type: 'hostage',
                status: 'active',
                lat: 0,
                lng: 0,
                battery: 100, // Can use expo-battery
                audio_live: true,
            })
            .select()
            .single();

        if (error) throw error;

        // 2. Start high-frequency location tracking
        const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
        if (locStatus === 'granted') {
            locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000,
                    distanceInterval: 10,
                },
                async (location) => {
                    // Update incident with live coordinates
                    await supabase
                        .from('incidents')
                        .update({
                            lat: location.coords.latitude,
                            lng: location.coords.longitude,
                        })
                        .eq('id', incident.id);
                }
            );
        }

        // 3. Start Audio Recording
        const { status: audStatus } = await Audio.requestPermissionsAsync();
        if (audStatus === 'granted') {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: r } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.LOW_QUALITY
            );
            recording = r;
            console.log('Audio recording started...');

            // Real implementation would stream chunks to Supabase Storage or WebSocket
            // For MVP, we simulate it
        }

    } catch (error) {
        console.error('Failed to start stealth mode:', error);
    }
};

export const stopStealthMode = async () => {
    if (locationSubscription) {
        locationSubscription.remove();
        locationSubscription = null;
    }

    if (recording) {
        await recording.stopAndUnloadAsync();
        recording = null;
    }

    console.log('Stealth SOS deactivated.');
};
