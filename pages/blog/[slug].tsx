import { GetStaticProps, GetStaticPaths } from 'next'
import { format } from 'date-fns'
import Image from 'next/image'
import {Blog} from '../../lib/api'
import {markdownToHtml} from '../../lib/markdownToHtml'
