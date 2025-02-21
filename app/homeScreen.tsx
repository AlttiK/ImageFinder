import { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [allPhotos, setAllPhotos] = useState<MediaLibrary.Asset[]>([]);

  // Fetch initial photos
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({ first: 100 });
        setAllPhotos(media.assets);
        setFilteredPhotos(media.assets);
      }
    })();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement your DeepSeek search logic here
    // This is where you'd integrate with your AI service
  };

  const addFilter = () => {
    if (searchQuery.trim() && !activeFilters.includes(searchQuery)) {
      const newFilters = [...activeFilters, searchQuery];
      setActiveFilters(newFilters);
      setSearchQuery('');
      // Implement multi-layer filtering here
      applyFilters(newFilters);
    }
  };

  const removeFilter = (index: number) => {
    const newFilters = activeFilters.filter((_, i) => i !== index);
    setActiveFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (filters: string[]) => {
    // Implement your actual filtering logic with DeepSeek here
    // For now, just filter photos with even index as demo
    const filtered = allPhotos.filter((_, index) => 
      filters.every(() => index % 2 === 0) // Replace with actual AI filtering
    );
    setFilteredPhotos(filtered);
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.logo}>PhotoFinder</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search photos..."
          onChangeText={handleSearch}
          value={searchQuery}
          onSubmitEditing={addFilter}
          style={styles.searchBar}
          iconColor="#2a5298"
          inputStyle={{ color: '#1e3c72' }}
        />
        
        {/* Active Filters */}
        <View style={styles.filterContainer}>
          {activeFilters.map((filter, index) => (
            <Chip
              key={index}
              mode="outlined"
              onClose={() => removeFilter(index)}
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {filter}
            </Chip>
          ))}
        </View>
      </View>

      {/* Photo Grid */}
      <FlatList
        data={filteredPhotos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Image 
            source={{ uri: item.uri }} 
            style={styles.image} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  header: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBar: {
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    margin: 2,
    backgroundColor: '#e8f0fe',
    borderColor: '#2a5298',
  },
  chipText: {
    color: '#1e3c72',
  },
  grid: {
    padding: 2,
  },
  image: {
    width: width / 3 - 4,
    height: width / 3 - 4,
    margin: 2,
    borderRadius: 4,
  },
});
