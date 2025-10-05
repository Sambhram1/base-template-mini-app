// scripts/deploy-contract.js
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying LuxLinkNFT contract...");
  
  // Debug network and signers
  const network = await ethers.provider.getNetwork();
  console.log("Connected to network:", network.name, "Chain ID:", network.chainId);
  
  const signers = await ethers.getSigners();
  console.log("Available signers:", signers.length);
  
  if (signers.length === 0) {
    throw new Error("No signers available. Check your private key configuration.");
  }

  // Get the contract factory
  const LuxLinkNFT = await ethers.getContractFactory("LuxLinkNFT");

  // Get the deployer account
  const [deployer] = signers;
  console.log("Deploying contracts with the account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract with the deployer as the initial owner
  const luxLinkNFT = await LuxLinkNFT.deploy(deployer.address);
  await luxLinkNFT.waitForDeployment();

  const contractAddress = await luxLinkNFT.getAddress();
  console.log("LuxLinkNFT deployed to:", contractAddress);

  // Register some example manufacturers for demo purposes
  console.log("\nRegistering demo manufacturers...");
  
  const manufacturers = [
    { address: "0x742d35cc6634c0532925a3b8d94959fbed66204b", brand: "Hermès" },
    { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", brand: "Rolex" },
    { address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", brand: "Gucci" }
  ];

  for (const manufacturer of manufacturers) {
    try {
      await luxLinkNFT.registerManufacturer(manufacturer.address, manufacturer.brand);
      console.log(`✅ Registered ${manufacturer.brand} at ${manufacturer.address}`);
    } catch (error) {
      console.log(`❌ Failed to register ${manufacturer.brand}: ${error.message}`);
    }
  }

  console.log("\n📋 Deployment Summary:");
  console.log("=".repeat(50));
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
  console.log(`Gas Used: ${(await luxLinkNFT.deploymentTransaction()).gasLimit}`);
  console.log(`Deployer: ${deployer.address}`);
  
  // Save deployment info for frontend
  const networkInfo = await ethers.provider.getNetwork();
  const deploymentInfo = {
    contractAddress,
    network: networkInfo.name,
    chainId: Number(networkInfo.chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    manufacturers
  };

  const fs = require('fs');
  const path = require('path');
  
  // Ensure contracts directory exists
  const contractsDir = './src/contracts';
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(contractsDir, 'deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n💾 Deployment info saved to src/contracts/deployment.json");

  // Verify contract on Basescan (if on Base network)
  if (process.env.BASESCAN_API_KEY) {
    console.log("\n🔍 Verifying contract on Basescan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [deployer.address],
      });
      console.log("✅ Contract verified on Basescan");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });