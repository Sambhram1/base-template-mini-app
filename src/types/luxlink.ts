export interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  contractAddress: string;
  tokenId: string;
  brand?: string;
  category?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface Post {
  id: string;
  authorFid: number;
  authorUsername: string;
  authorBasename?: string;
  authorAvatar?: string;
  nft: NFTMetadata;
  caption: string;
  timestamp: number;
  reactions: PostReactions;
  isVerified: boolean;
  verificationStatus: 'verified' | 'unverified' | 'pending' | 'error';
}

export interface PostReactions {
  love: number;
  fire: number;
  diamond: number;
  total: number;
  userReactions: string[];
}

export interface User {
  fid: number;
  username: string;
  basename?: string;
  avatar?: string;
  connectedWallet?: string;
  verifiedNFTs: NFTMetadata[];
}

export interface TradeOffer {
  id: string;
  fromFid: number;
  toFid: number;
  offerNFT: NFTMetadata;
  requestNFT?: NFTMetadata;
  ethAmount?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  timestamp: number;
}

export type Tab = 'scan' | 'mint';

export type ReactionType = 'love' | 'fire' | 'diamond';