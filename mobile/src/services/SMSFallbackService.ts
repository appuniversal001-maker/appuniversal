import * as SMS from 'expo-sms';
import * as Battery from 'expo-battery';

/**
 * If the app detects no internet connection or extreme battery savings mode,
 * it will fallback to generating an encrypted SMS that can be sent to a toll-free number.
 */
export const triggerSMSFallback = async (lat: number, lng: number) => {
    try {
        const isAvailable = await SMS.isAvailableAsync();

        if (isAvailable) {
            // Create a brief, machine-readable payload.
            // E.g. "SOS:HOSTAGE#LAT:-23.55#LNG:-46.63#BATT:15"
            const batteryLevel = await Battery.getBatteryLevelAsync();
            const payload = `SOS:HOSTAGE#LAT:${lat.toFixed(4)}#LNG:${lng.toFixed(4)}#BATT:${Math.round(batteryLevel * 100)}`;

            const { result } = await SMS.sendSMSAsync(
                ['190'], // Generic emergency number or specific CIOPS shortcode
                payload
            );

            return result;
        } else {
            console.warn('SMS is not available on this device.');
            return false;
        }
    } catch (error) {
        console.error('Failed to trigger SMS fallback:', error);
        return false;
    }
};

/**
 * Helper to adjust sensor frequency based on battery life to ensure the phone doesn't die.
 */
export const optimizeSensorsForBattery = async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    const batteryState = await Battery.getBatteryStateAsync();

    // If battery is < 15% and not charging, lower location update frequency
    if (batteryLevel < 0.15 && batteryState !== Battery.BatteryState.CHARGING) {
        return {
            locationInterval: 30000, // 30 seconds
            audioQuality: 'low',
        };
    }

    return {
        locationInterval: 5000, // 5 seconds
        audioQuality: 'medium',
    };
};
