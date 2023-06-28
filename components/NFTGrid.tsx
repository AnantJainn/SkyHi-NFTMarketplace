// import type {NFT as NFTType } from "@thirdweb-dev/sdk";
// import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
// import React from "react";
// import NFT from "./NFT";
// import Link from "next/link";
// import { NFT_COLLECTION_ADDRESS } from "../const/addresses";

// type Props = {
//     isLoading: boolean;
//     data: NFTType[] | undefined;
//     overrideOnclickBehavior?: (nft: NFTType) => void;
//     emptyText?: string;
// };

// export default function NFTGrid({
//     isLoading,
//     data,
//     overrideOnclickBehavior,
//     emptyText = "No NFTs found",
// }: Props) {
//     return (
//         <SimpleGrid columns={4} spacing={6} w={"100%"} padding={2.5} my={5}>
//             {isLoading ? (
//                 [...Array(20)].map((_, index) => (
//                     <Skeleton key={index} height={"312px"} width={"100%"} />
//                 ))
//             ) : data && data.length > 0 ? (
//                 data.map((nft) => 
//                     !overrideOnclickBehavior ? (
//                         <Link
//                             href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
//                             key={nft.metadata.id}
//                         >
//                         <NFT nft={nft} />
//                         </Link>
//                     ) : (
//                         <div
//                             key={nft.metadata.id}
//                             onClick={() => overrideOnclickBehavior(nft)}
//                         >
//                             <NFT nft={nft} />
//                         </div>
//                     ))
//             ) : (
//                 <Text>{emptyText}</Text>
//             )}
//         </SimpleGrid>
        
//     )
// };


import React, { useState, useEffect } from "react";
import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import NFT from "./NFT";
import Link from "next/link";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";

type Props = {
    isLoading: boolean;
    data: NFTType[] | undefined;
    overrideOnclickBehavior?: (nft: NFTType) => void;
    emptyText?: string;
};

export default function NFTGrid({
    isLoading,
    data,
    overrideOnclickBehavior,
    emptyText = "No NFTs found",
}: Props) {
    const [hashes, setHashes] = useState<Record<string, string>>({});

    // Function to generate a new hash. Replace this with your hash generation logic.
    const generateNewHash = (id: string) => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Update hashes every 10 minutes
    useEffect(() => {
        const updateHashes = () => {
            if (data) {
                const newHashes: Record<string, string> = {};
                data.forEach(nft => {
                    newHashes[nft.metadata.id] = generateNewHash(nft.metadata.id);
                });
                setHashes(newHashes);
            }
        }

        updateHashes();
        const interval = setInterval(updateHashes, 10 * 60 * 1000); // 10 minutes in milliseconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [data]);

    return (
        <SimpleGrid columns={4} spacing={6} w={"100%"} padding={2.5} my={5}>
            {isLoading ? (
                [...Array(20)].map((_, index) => (
                    <Skeleton key={index} height={"312px"} width={"100%"} />
                ))
            ) : data && data.length > 0 ? (
                data.map((nft) => (
                    <Link
                        href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}#${hashes[nft.metadata.id] || ''}`}
                        key={nft.metadata.id}
                        passHref
                    >
                        <div onClick={overrideOnclickBehavior ? () => overrideOnclickBehavior(nft) : undefined}>
                            <NFT nft={nft} />
                        </div>
                    </Link>
                ))
            ) : (
                <Text>{emptyText}</Text>
            )}
        </SimpleGrid>
    );
};
