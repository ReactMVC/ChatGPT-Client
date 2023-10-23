import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Linking, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image source={require('./assets/icon.png')} style={styles.logo} />
            <Text style={styles.title}>ChatGPT</Text>
            <Text style={styles.subtitle}>Open source chatbot app</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat')}>
                <Icon name="comment" size={30} color="#000" />
                <Text style={styles.buttonText}>ChatBot</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => Alert('Coming Soon', 'This section will be activated soon...')}>
                <Icon name="image" size={30} color="#000" />
                <Text style={styles.buttonText}>Image Generation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('market://details?id=com.chatbot.pira')}>
                <Icon name="star" size={30} color="#000" />
                <Text style={styles.buttonText}>Rate App</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://github.com/ReactMVC/ChatGPT-Client')}>
                <Icon name="github" size={30} color="#000" />
                <Text style={styles.buttonText}>Github</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>Developer: Hossein Pira</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 20,
        color: '#666',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ddd',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    buttonText: {
        marginLeft: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 10,
    },
});

export default Home;