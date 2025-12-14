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

export interface LolChampion {
    id: number;
    name: string;
    title: string;
    image: {
        full: string;
    };
}

interface ChampionCardProps {
    champion: LolChampion;
    isLiked: boolean;
    onToggle: () => void;
}

const ChampionCard = ({ champion, isLiked, onToggle }: ChampionCardProps) => {
    return (
        <View
            style={{
                width: "30%",
                marginBottom: 16,
                alignItems: "center",
                position: "relative",
            }}
        >
            <Link
                href={{
                    pathname: "/champions/[id]",
                    params: { id: champion.id.toString() },
                }}
                asChild
            >
                <Pressable
                    style={{
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

            <Pressable
                onPress={onToggle}
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 4,
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        color: isLiked ? "#f97373" : "#9ca3af",
                    }}
                >
                    {isLiked ? "♥" : "♡"}
                </Text>
            </Pressable>
        </View>
    );
};

export default function ChampionsScreen() {
    const [champions, setChampions] = useState<LolChampion[]>([]);
    const [likedIds, setLikedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadChampions = async () => {
            try {
                const response = await fetch(API_URL);
                const json = await response.json();

                const mapped: LolChampion[] = json.map((item: any) => {
                    return {
                        id: item.id,
                        name: item.name,
                        title: item.title,
                        image: {
                            full: item.image.full,
                        },
                    };
                });

                setChampions(mapped);
            } catch (error) {
                console.log("Error fetching champions", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadChampions();
    }, []);

    useEffect(() => {
        const loadLiked = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored) as number[];
                    setLikedIds(parsed);
                }
            } catch (error) {
                console.log("Error loading liked ids", error);
            }
        };

        loadLiked();
    }, []);

    const toggleFavorite = (id: number) => {
        let updated = [...likedIds];

        if (updated.includes(id)) {
            updated = updated.filter((x) => x !== id);
        } else {
            updated.push(id);
        }

        setLikedIds(updated);

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(
            (error) => {
                console.log("Error saving liked ids", error);
            }
        );
    };

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
                    Champions aan het laden...
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
                Alle champions
            </Text>

            <ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    {champions.map((champion) => (
                        <ChampionCard
                            key={champion.id}
                            champion={champion}
                            isLiked={likedIds.includes(champion.id)}
                            onToggle={() => toggleFavorite(champion.id)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
