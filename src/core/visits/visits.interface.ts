export interface IPortfolioVisit {
	/** Unique identifiers */
	id: string;
	sessionId: string;
	visitorId?: string;

	/** Timestamp */
	visitedAt: string;

	/** Request */
	request: IRequestInfo;

	/** Page */
	page: IPageInfo;

	/** Browser */
	browser: IBrowserInfo;

	/** Device */
	device: IDeviceInfo;

	/** Location (derived from IP) */
	location?: ILocationInfo;

	/** Marketing */
	utm?: IUtmInfo;

	/** Traffic */
	traffic: ITrafficInfo;

	/** Network */
	network?: INetworkInfo;

	/** Client */
	client: IClientInfo;

	/** Performance */
	performance?: IPerformanceInfo;
}

export interface IRequestInfo {
	ip: string;
	forwardedFor?: string;
	host: string;
	protocol: string;
	method: string;
	userAgent: string;
	acceptLanguage?: string;
	origin?: string;
	referer?: string;
}

export interface IPageInfo {
	url: string;
	pathname: string;
	title?: string;
	query?: Record<string, string>;
	hash?: string;
}

export interface IBrowserInfo {
	name: string;
	version: string;
	engine?: string;
	language: string;
	languages?: string[];
	cookiesEnabled: boolean;
	javaEnabled?: boolean;
	doNotTrack?: string | null;
}

export interface IDeviceInfo {
	type: 'desktop' | 'tablet' | 'mobile' | 'bot' | 'unknown';
	os: string;
	osVersion?: string;
	manufacturer?: string;
	model?: string;
	cpuArchitecture?: string;

	screen: {
		width: number;
		height: number;
		availWidth?: number;
		availHeight?: number;
		colorDepth?: number;
		pixelRatio: number;
	};

	viewport: {
		width: number;
		height: number;
	};

	touchPoints?: number;
}

export interface ILocationInfo {
	ip: string;

	continent?: string;
	continentCode?: string;

	country?: string;
	countryCode?: string;

	region?: string;
	regionCode?: string;

	city?: string;
	district?: string;
	postalCode?: string;

	latitude?: number;
	longitude?: number;

	timezone?: string;
	utcOffset?: string;

	isp?: string;
	organization?: string;
	asn?: string;

	accuracyRadius?: number;
}

export interface INetworkInfo {
	connectionType?: string;
	effectiveType?: string;
	downlink?: number;
	rtt?: number;
	saveData?: boolean;
}

export interface IClientInfo {
	fingerprint?: string;
	timezone: string;
	locale: string;
	platform?: string;
	online: boolean;
	memoryGB?: number;
	cpuCores?: number;
}

export interface ITrafficInfo {
	referrer?: string;

	source?: string;
	medium?: string;
	campaign?: string;

	landingPage: string;

	isFirstVisit?: boolean;
	isReturningVisitor?: boolean;
}

export interface IUtmInfo {
	source?: string;
	medium?: string;
	campaign?: string;
	term?: string;
	content?: string;

	id?: string;

	gclid?: string;
	fbclid?: string;
	msclkid?: string;
	ttclid?: string;

	affiliateId?: string;
}

export interface IPerformanceInfo {
	pageLoadMs?: number;
	dnsLookupMs?: number;
	tcpConnectionMs?: number;
	firstPaintMs?: number;
	firstContentfulPaintMs?: number;
	largestContentfulPaintMs?: number;
	cumulativeLayoutShift?: number;
}

export interface IRecruiterVisit {
	company?: string;
	linkedinDetected?: boolean;
	githubDetected?: boolean;

	entryPage: string;
	exitPage?: string;

	pagesVisited: string[];
	totalPages: number;

	sessionDurationSeconds?: number;

	resumeDownloaded: boolean;
	resumeViewed: boolean;

	contactClicked: boolean;
	emailClicked: boolean;
	phoneClicked: boolean;

	githubClicked: boolean;
	linkedinClicked: boolean;

	projectClicks: IProjectClick[];
}

export interface IProjectClick {
	projectId: string;
	projectName: string;
	timestamp: string;
}