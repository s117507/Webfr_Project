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

export interface Champion {
    id: number;
    name: string;
    image: {
        full: string;
    };
}

interface ChampionCardProps {
    champion: Champion;
    liked: boolean;
    onToggleLike: () => void;
}

const STORAGE_KEY = "likedChampions";

const ChampionCard = ({ champion, liked, onToggleLike }: ChampionCardProps) => {
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
                onPress={onToggleLike}
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
                        color: liked ? "#f97373" : "#9ca3af",
                    }}
                >
                    {liked ? "♥" : "♡"}
                </Text>
            </Pressable>
        </View>
    );
};

const ChampionsScreen = () => {
    const [champions, setChampions] = useState<Champion[]>([]);
    const [likedIds, setLikedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadChamps() {
            try {
                const response = await fetch(
                    "https://sampleapis.assimilate.be/lol/champions"
                );
                const data = await response.json();

                const mapped: Champion[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    image: { full: item.image.full },
                }));

                setChampions(mapped);
            } catch (err) {
                console.error(err);
                setError("Failed to load champions");
            } finally {
                setLoading(false);
            }
        }

        loadChamps();
    }, []);

    useEffect(() => {
        async function loadLiked() {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored) as number[];
                    setLikedIds(parsed);
                }
            } catch (err) {
                console.error("Error loading liked champions", err);
            }
        }

        loadLiked();
    }, []);

    const toggleLike = async (id: number) => {
        setLikedIds((prev) => {
            let updated: number[];
            if (prev.includes(id)) {
                updated = prev.filter((x) => x !== id);
            } else {
                updated = [...prev, id];
            }

            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(
                (err) => {
                    console.error("Error saving liked champions", err);
                }
            );

            return updated;
        });
    };

    if (loading) {
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
                    Loading champions...
                </Text>
            </View>
        );
    }

    if (error) {
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
                <Text style={{ color: "#f87171" }}>{error}</Text>
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
                Champions
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
                            liked={likedIds.includes(champion.id)}
                            onToggleLike={() => toggleLike(champion.id)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default ChampionsScreen;
