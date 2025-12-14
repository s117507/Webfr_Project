import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://sampleapis.assimilate.be/lol/champions";
const STORAGE_KEY = "likedChampionsIds";

interface LolChampion {
    id: number;
    name: string;
    image: {
        full: string;
    };
}

export default function LikedScreen() {
    const [likedChampions, setLikedChampions] = useState<LolChampion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                const ids: number[] = stored ? JSON.parse(stored) : [];

                if (ids.length === 0) {
                    setLikedChampions([]);
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(API_URL);
                const json = await response.json();

                const mapped: LolChampion[] = json
                    .map((item: any) => {
                        return {
                            id: item.id,
                            name: item.name,
                            image: {
                                full: item.image.full,
                            },
                        };
                    })
                    .filter((champ: LolChampion) => ids.includes(champ.id));

                setLikedChampions(mapped);
            } catch (error) {
                console.log("Error loading favorites", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();
    }, []);

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#020617",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" />
                <Text style={{ color: "#e5e7eb", marginTop: 8 }}>
                    Favorieten aan het laden...
                </Text>
            </View>
        );
    }

    if (likedChampions.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#020617",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 16,
                }}
            >
                <Text
                    style={{
                        color: "#e5e7eb",
                        fontSize: 16,
                        textAlign: "center",
                    }}
                >
                    Je hebt nog geen champions geliked.{"\n"}
                    Ga naar de lijst en tik op de hartjes.
                </Text>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#020617",
                paddingHorizontal: 12,
                paddingTop: 16,
            }}
        >
            <Text
                style={{
                    color: "#f9fafb",
                    fontSize: 22,
                    fontWeight: "bold",
                    marginBottom: 8,
                }}
            >
                Favoriete champions
            </Text>

            <ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    {likedChampions.map((champion) => (
                        <Link
                            key={champion.id}
                            href={{
                                pathname: "/champions/[id]",
                                params: { id: champion.id.toString() },
                            }}
                            asChild
                        >
                            <Pressable
                                style={{
                                    width: "30%",
                                    marginBottom: 16,
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={{ uri: champion.image.full }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 8,
                                        marginBottom: 4,
                                    }}
                                />
                                <Text
                                    style={{
                                        color: "#e5e7eb",
                                        fontSize: 12,
                                        textAlign: "center",
                                    }}
                                    numberOfLines={1}
                                >
                                    {champion.name}
                                </Text>
                            </Pressable>
                        </Link>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
