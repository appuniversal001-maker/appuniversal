import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Vibration } from 'react- नामित';
import { startStealthMode } from '../services/StealthService';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - 48) / 4;

const SOS_CODE = '1900';

export default function CalculatorFacade() {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [isSOSActive, setIsSOSActive] = useState(false);

    // Hidden Trigger: If the user types '1900' and presses '=', the SOS is triggered silently.
    const handlePress = (value: string) => {
        if (value === 'C') {
            setDisplay('0');
            setEquation('');
        } else if (value === '=') {
            if (display === SOS_CODE) {
                triggerSOS();
            } else {
                try {
                    // A very basic eval for the fake calculator to seem real
                    // eslint-disable-next-line no-eval
                    const result = eval(equation + display);
                    setDisplay(String(result));
                    setEquation('');
                } catch (e) {
                    setDisplay('Error');
                }
            }
        } else if (['+', '-', '*', '/'].includes(value)) {
            setEquation(display + value);
            setDisplay('0');
        } else {
            setDisplay(display === '0' ? value : display + value);
        }
    };

    const triggerSOS = async () => {
        if (isSOSActive) return;

        // Asymmetric haptic feedback (silent validation)
        Vibration.vibrate([0, 50, 100, 50]);

        setIsSOSActive(true);
        // Keep the calculator looking normal!
        setDisplay('0');
        setEquation('');

        // Start background services (GPS, Audio, WebSockets)
        await startStealthMode();
    };

    return (
        <View style={styles.container}>
            <View style={styles.displayContainer}>
                <Text style={styles.equationText}>{equation}</Text>
                <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
                    {display}
                </Text>
            </View>

            <View style={styles.keypad}>
                {[['C', '±', '%', '/'], ['7', '8', '9', '*'], ['4', '5', '6', '-'], ['1', '2', '3', '+'], ['0', '.', '=']].map((row, i) => (
                    <View key={i} style={styles.row}>
                        {row.map((btn) => (
                            <TouchableOpacity
                                key={btn}
                                style={[
                                    styles.button,
                                    btn === '0' && styles.buttonZero,
                                    ['/', '*', '-', '+', '='].includes(btn) && styles.buttonOperator,
                                    ['C', '±', '%'].includes(btn) && styles.buttonSpecial,
                                ]}
                                onPress={() => handlePress(btn)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        ['/', '*', '-', '+', '='].includes(btn) && styles.buttonTextWhite,
                                        ['C', '±', '%'].includes(btn) && styles.buttonTextDark,
                                    ]}
                                >
                                    {btn}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>

            {/* Invisible SOS Button for gesture triggering (e.g. 5 quick taps on top right) */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'flex-end',
    },
    displayContainer: {
        padding: 24,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
    },
    equationText: {
        color: '#666',
        fontSize: 24,
        marginBottom: 8,
    },
    displayText: {
        color: '#fff',
        fontSize: 80,
        fontWeight: '300',
    },
    keypad: {
        padding: 12,
        paddingBottom: 32,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    button: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonZero: {
        width: BUTTON_SIZE * 2 + 12,
        alignItems: 'flex-start',
        paddingLeft: 30,
    },
    buttonOperator: {
        backgroundColor: '#FF9F0A',
    },
    buttonSpecial: {
        backgroundColor: '#A5A5A5',
    },
    buttonText: {
        color: '#fff',
        fontSize: 32,
    },
    buttonTextDark: {
        color: '#000',
    },
    buttonTextWhite: {
        color: '#fff',
    },
});
