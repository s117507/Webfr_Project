import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Image,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

interface LolChampionDetail {
    id: number;
    name: string;
    title: string;
    blurb: string;
    partype: string;
    image: {
        full: string;
        loading: string;
    };
    tags: string[];
    stats: {
        hp: number;
        attackdamage: number;
        armor: number;
        spellblock: number;
        movespeed: number;
        attackrange: number;
    };
}

const API_URL = "https://sampleapis.assimilate.be/lol/champions";

export default function ChampionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [champion, setChampion] = useState<LolChampionDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadChampion = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                const found = data.find((item: any) => item.id === Number(id));

                if (found) {
                    const mapped: LolChampionDetail = {
                        id: found.id,
                        name: found.name,
                        title: found.title,
                        blurb: found.blurb,
                        partype: found.partype,
                        image: {
                            full: found.image.full,
                            loading: found.image.loading,
                        },
                        tags: found.tags,
                        stats: {
                            hp: found.stats.hp,
                            attackdamage: found.stats.attackdamage,
                            armor: found.stats.armor,
                            spellblock: found.stats.spellblock,
                            movespeed: found.stats.movespeed,
                            attackrange: found.stats.attackrange,
                        },
                    };
                    setChampion(mapped);
                } else {
                    setChampion(null);
                }
            } catch (error) {
                console.log("Error loading champion", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadChampion();
        }
    }, [id]);

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
                    Champion aan het laden...
                </Text>
            </View>
        );
    }

    if (!champion) {
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
                <Text style={{ color: "#f87171" }}>Champion niet gevonden.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#020617" }}>
            <Stack.Screen options={{ title: champion.name }} />

            <View
                style={{
                    width: "100%",
                    height: 260,
                    backgroundColor: "#000000",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    source={{ uri: champion.image.loading }}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    resizeMode="contain"
                />
            </View>

            <View style={{ padding: 16 }}>
                <Text
                    style={{
                        color: "#f9fafb",
                        fontSize: 24,
                        fontWeight: "bold",
                    }}
                >
                    {champion.name}
                </Text>
                <Text
                    style={{
                        color: "#9ca3af",
                        fontSize: 14,
                        marginBottom: 8,
                    }}
                >
                    {champion.title}
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginBottom: 12,
                    }}
                >
                    {champion.tags.map((tag) => (
                        <View
                            key={tag}
                            style={{
                                backgroundColor: "#2563eb",
                                borderRadius: 999,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                marginRight: 6,
                                marginBottom: 6,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#e5e7eb",
                                    fontSize: 11,
                                }}
                            >
                                {tag}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text
                    style={{
                        color: "#e5e7eb",
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 8,
                        marginBottom: 4,
                    }}
                >
                    Resource
                </Text>
                <Text
                    style={{
                        color: "#d1d5db",
                        fontSize: 14,
                    }}
                >
                    {champion.partype}
                </Text>

                <Text
                    style={{
                        color: "#e5e7eb",
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 12,
                        marginBottom: 4,
                    }}
                >
                    Samenvatting
                </Text>
                <Text
                    style={{
                        color: "#d1d5db",
                        fontSize: 14,
                        lineHeight: 20,
                    }}
                >
                    {champion.blurb}
                </Text>

                {/* stats */}
                <Text
                    style={{
                        color: "#e5e7eb",
                        fontWeight: "bold",
                        fontSize: 16,
                        marginTop: 12,
                        marginBottom: 4,
                    }}
                >
                    Basisstatistieken
                </Text>
                <View>
                    <Text style={{ color: "#e5e7eb", marginBottom: 2 }}>
                        HP: {champion.stats.hp}
                    </Text>
                    <Text style={{ color: "#e5e7eb", marginBottom: 2 }}>
                        Attack damage: {champion.stats.attackdamage}
                    </Text>
                    <Text style={{ color: "#e5e7eb", marginBottom: 2 }}>
                        Armor: {champion.stats.armor}
                    </Text>
                    <Text style={{ color: "#e5e7eb", marginBottom: 2 }}>
                        Magic resist: {champion.stats.spellblock}
                    </Text>
                    <Text style={{ color: "#e5e7eb", marginBottom: 2 }}>
                        Movespeed: {champion.stats.movespeed}
                    </Text>
                    <Text style={{ color: "#e5e7eb", marginBottom: 2 }}>
                        Attack range: {champion.stats.attackrange}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
