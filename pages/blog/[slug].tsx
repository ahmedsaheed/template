import { GetStaticProps, GetStaticPaths } from 'next'
import { format } from 'date-fns'
import {markdownToHtml} from '../../lib/markdownToHtml'
import Layout from '../../components/layout'
import { Blog,getContentBySlug, getAllContent } from '../../lib/api'
import { getPlaiceholder } from 'plaiceholder'
import Link from 'next/link'
const readingTime = require("reading-time")


function BlogPage({ writing }: { writing: Blog }) {
    return (
      <>
            <br/>
            <Link href="/" className="read hover-underline-animation link active"> ← Go Back</Link>
    <div className="post-title">
    <h1>{writing.title}</h1>
    <p className="post-date">
    {format(new Date(writing.date), 'MMM do, y')}| {readingTime(writing.content).minutes < 1
                                                            ? 1
                                                            : readingTime(writing.content).minutes
                                                                  .toString()
                                                                  .substring(0, 3)}{" "} min read
    </p>
    </div>
    <div className="prose mx-auto max-w-3xl space-y-5"  dangerouslySetInnerHTML={{ __html: writing.content }}>

    </div>
    </>
    )
}

export default Layout(BlogPage)

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const writing = getContentBySlug('blog', params?.slug as string, [
      'title',
      'description',
      'date',
      'slug',
      'content',
      'tags',
      'heroImage',
    ]) as Blog
  
    const content = await markdownToHtml(writing.content || '')
  
    const { base64 = '' } = writing.heroImage
      ? await getPlaiceholder(writing.heroImage, { size: 4 })
      : {}
  
    return {
      props: {
        writing: {
          ...writing,
          content,
          blurDataURL: base64,
        },
      },
    }
  }
  
  export const getStaticPaths: GetStaticPaths = async () => {
    const blog = getAllContent('blog', ['slug']) as Blog[]
  
    return {
      paths: blog.map((writing) => {
        return {
          params: {
            slug: writing.slug,
          },
        }
      }),
      fallback: false,
    }
  }