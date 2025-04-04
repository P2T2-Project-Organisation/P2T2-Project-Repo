(function () {
    // LocalStorage keys for reference
    const savedResponseKey = 'response';
    // const preloadedImagesKey = 'preloaded';
    // const preloadingImagesKey = 'preloading';

    // Settings for cache aggressiveness
    const artworksToPrefetch = 50;
    // const imagesToPreload = 7;
    // const imagesToPreloadPerSession = 3;
    // let imagesPreloadedThisSession = 0;

    let tombstoneElement: HTMLAnchorElement;
    let titleElement: HTMLElement;
    let artistElement: HTMLElement;
    let artworkContainer: HTMLElement;
    let viewer: OpenSeadragon.Viewer;

    interface Thumbnail {
        width: number;
        height: number;
    }

    interface Artwork {
        id: number;
        title: string;
        artist_title: string;
        date_display: string;
        image_id: string;
        thumbnail: Thumbnail;
    }

    interface ApiResponse {
        data: Artwork[];
    }

    document.addEventListener('DOMContentLoaded', function () {
        tombstoneElement = document.getElementById('tombstone') as HTMLAnchorElement;
        titleElement = document.getElementById('title')!;
        artistElement = document.getElementById('artist')!;
        artworkContainer = document.getElementById('artwork-container')!;

        viewer = OpenSeadragon({
            element: artworkContainer,
            prefixUrl: '//openseadragon.github.io/openseadragon/images/',
            homeFillsViewer: false,
            mouseNavEnabled: false,
            springStiffness: 15,
            visibilityRatio: 1,
            zoomPerScroll: 1.2,
            zoomPerClick: 1.3,
            immediateRender: true,
            constrainDuringPan: true,
            animationTime: 1.5,
            minZoomLevel: 0,
            minZoomImageRatio: 0.8,
            maxZoomPixelRatio: 1.0,
            defaultZoomLevel: 0,
            gestureSettingsMouse: {
                scrollToZoom: true,
            },
            showZoomControl: false,
            showHomeControl: false,
            showFullPageControl: false,
            showRotationControl: false,
            showSequenceControl: false,
        });

        const savedResponse = JSON.parse(localStorage.getItem(savedResponseKey) || 'null') as Partial<ApiResponse> | null;

        if (savedResponse?.data && Array.isArray(savedResponse.data) && savedResponse.data.length > 0) {
            const validData: Artwork[] = savedResponse.data.filter(validateArtwork);
            if (validData.length > 0) {
                processResponse({ data: validData });
            }
        } else {
            getJson('https://api.artic.edu/api/v1/search', getQuery(), processResponse);
        }
    });

    function getJson(url: string, body: object, callback: (response: ApiResponse) => void): void {
        const request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                callback(JSON.parse(request.responseText));
            }
        };
        request.send(JSON.stringify(body));
    }

    function processResponse(response: ApiResponse): void {
        if (!response.data || response.data.length === 0) return;

        const artwork = response.data.shift()!;
        localStorage.setItem(savedResponseKey, JSON.stringify(response));
        updatePage(artwork);
    }

    function updatePage(artwork: Artwork): void {
        artistElement.textContent = `${artwork.artist_title}, ${artwork.date_display}`;
        titleElement.textContent = artwork.title;
        const linkToArtwork = `https://www.artic.edu/artworks/${artwork.id}/${slugify(artwork.title)}`;
        tombstoneElement.href = linkToArtwork;

        const downloadUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/3000,/0/default.jpg`;
        document.getElementById('download-link')!.setAttribute('href', downloadUrl);
        document.getElementById('download-link')!.setAttribute('download', `${artwork.title}.jpg`);

        addTiledImage(artwork, false);
    }

    function addTiledImage(artwork: Artwork, isPreload: boolean): void {
        viewer.addTiledImage({
            tileSource: {
                type: 'legacy-image-pyramid',
                levels: [
                    getIIIFLevel(artwork, 200),
                    getIIIFLevel(artwork, 400),
                    getIIIFLevel(artwork, 843),
                    getIIIFLevel(artwork, 1686),
                ],
            },
            opacity: isPreload ? 0 : 1,
            preload: isPreload,
        });
    }

    function getIIIFLevel(artwork: Artwork, displayWidth: number) {
        return {
            url: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/${displayWidth},/0/default.jpg`,
            width: displayWidth,
            height: Math.floor((artwork.thumbnail.height * displayWidth) / artwork.thumbnail.width),
        };
    }

    function getQuery() {
        return {
            resources: 'artworks',
            fields: ['id', 'title', 'artist_title', 'image_id', 'date_display', 'thumbnail'],
            limit: artworksToPrefetch,
            query: {
                function_score: {
                    query: {
                        bool: {
                            filter: [
                                { term: { is_public_domain: true } },
                                { exists: { field: 'image_id' } },
                                { exists: { field: 'thumbnail.width' } },
                                { exists: { field: 'thumbnail.height' } },
                            ],
                        },
                    },
                    boost_mode: 'replace',
                    random_score: { field: 'id', seed: getSeed() },
                },
            },
        };
    }

    function getSeed(): number {
        return Date.now();
    }

    function slugify(text: string): string {
        return text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    function validateArtwork(item: any): item is Artwork {
        return (
            typeof item.id === 'number' &&
            typeof item.title === 'string' &&
            typeof item.artist_title === 'string' &&
            typeof item.date_display === 'string' &&
            typeof item.image_id === 'string' &&
            item.thumbnail &&
            typeof item.thumbnail.width === 'number' &&
            typeof item.thumbnail.height === 'number'
        );
    }
})();
