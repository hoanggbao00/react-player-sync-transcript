export interface ITranscript {
  info: ITranscriptionInfo
  language: string
  segments: ITranscriptionSegment[]
  text: string
}

export interface ITranscriptionInfo {
  title: string
  description: string
  channelName: string
  duration: number
}

export interface ITranscriptionSegment {
  avg_logprob: number
  compression_ratio: number
  end: number
  id: number
  no_speech_prob: number
  seek: number
  start: number
  temperature: number
  text: string
  tokens: null
  transient: boolean
}
